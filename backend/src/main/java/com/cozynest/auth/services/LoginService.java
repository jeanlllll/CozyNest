package com.cozynest.auth.services;

import com.cozynest.auth.entities.*;
import com.cozynest.auth.helper.CookieGenerateHelper;
import com.cozynest.auth.helper.JwtUtil;
import com.cozynest.auth.repositories.ShopUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LoginService {

    /* two types of login
        1. manual login, with password
        2. google oauth2 login, no need to check for password */

    /* account will be locked if 5 attempts fail in a day
       if locked, will be unlocked after 24 hours
       if not locked, it will reset the login attempts to 0 every day */

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_HOURS = 24;

    @Autowired
    ShopUserRepository shopUserRepository;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    CookieGenerateHelper cookieGenerateHelper;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Value("${jwt.access_token.expiration_time}")
    private int access_token_expiration;

    @Value("${jwt.refresh_token.expiration_time}")
    private int refresh_token_expiration;

    @Transactional
    public ResponseEntity<?> login(String email, String password, HttpServletRequest request, HttpServletResponse response, AuthProvider loginProvider) {
        ShopUser user = shopUserRepository.findByEmail(email);

        // 1. Check if the user exists
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }

        // 2. if user's actual provider does not match this incoming provider
        String providerMismatchMessage = getProviderMismatchMessage(user, loginProvider);
        if (providerMismatchMessage != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(providerMismatchMessage);
        }

        // 3. Check email verification for manual login
        if (!user.getIsVerified() && loginProvider.equals(AuthProvider.MANUAL)) {
            return new ResponseEntity<>("Please verify email first", HttpStatus.FORBIDDEN);
        }

        //4. Handle manual login (password verification)
        if (loginProvider.equals(AuthProvider.MANUAL)) {
            ResponseEntity<?> loginResponse = handleManualLogin(user, password);
            if (loginResponse.getStatusCode() != HttpStatus.OK) {
                return loginResponse;
            }
        }

        // 5. Generate JWT tokens and set cookies
        generateAndSetTokens(request, response, user);

        return new ResponseEntity<>("Login successfully", HttpStatus.OK);
    }

    private String getProviderMismatchMessage(ShopUser user, AuthProvider loginProvider) {
        Set<AuthProvider> registeredProviders = user.getClient().getClientProviders().stream()
                .map(cp -> cp.getId().getAuthProvider())
                .collect(Collectors.toSet());
        if (loginProvider.equals(AuthProvider.MANUAL) && registeredProviders.contains(AuthProvider.GOOGLE)) {
            return "You registered using Google OAuth2. Please log in with Google or reset your password to enable manual login.";
        }
        if (loginProvider.equals(AuthProvider.GOOGLE) && registeredProviders.contains(AuthProvider.MANUAL)) {
            return "You registered using email and password. Do you want to link this account to Google?";
        }
        return null;
    }


    private ResponseEntity<?> handleManualLogin(ShopUser user, String password) {
        //reset failed attempts if login data is a new day
        if (!user.getIsLocked() && user.getLastLoginAttemptsDate() != null && !user.getLastLoginAttemptsDate().toLocalDate().equals(LocalDateTime.now().toLocalDate())) {
            user.setLoginFailedAttempts(0);
        }

        // Account is Locked & Still Within Lock Time > Do Nothing
        if (user.getIsLocked() && user.getLockExpiresAt().isAfter(LocalDateTime.now())) {
            return new ResponseEntity<>("Too many failed attempts. Your account is locked until " + user.getLockExpiresAt(), HttpStatus.FORBIDDEN);
        }

        // Account is Locked & Lock Time Expired > Unlock
        if (user.getIsLocked() && user.getLockExpiresAt().isBefore(LocalDateTime.now())) {
            user.setIsLocked(false);
            user.setLoginFailedAttempts(0);
            user.setLockExpiresAt(null);
            user.setLastLoginAttemptsDate(null);
        }

        // password incorrect
        if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
            user.setLoginFailedAttempts(user.getLoginFailedAttempts() + 1);
            user.setLastLoginAttemptsDate(LocalDateTime.now());

            // Login Failed MAX_FAILED_ATTEMPTS Times > Lock the Account
            if (user.getLoginFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.setIsLocked(true);
                user.setLockExpiresAt(LocalDateTime.now().plusHours(LOCK_DURATION_HOURS));
                shopUserRepository.save(user);
                return new ResponseEntity<>("Too many failed attempts. Your account is locked for " + LOCK_DURATION_HOURS + " hours.", HttpStatus.FORBIDDEN);
            }

            shopUserRepository.save(user);
            return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
        } else {
            user.setLockExpiresAt(null);
            user.setIsLocked(false);
            user.setLoginFailedAttempts(0);
            user.setLastLoginAttemptsDate(null);
            shopUserRepository.save(user);
            return new ResponseEntity<>("Password correct and no locked", HttpStatus.OK);
        }
    }

    private void generateAndSetTokens(HttpServletRequest request, HttpServletResponse response, ShopUser user) {
        Set<AuthAuthority> authAuthorities = user.getAuthorities();
        List<String> authorities = authAuthorities.stream()
                .map(authAuthority -> authAuthority.getRoleCode()).collect(Collectors.toList());

        String email = user.getEmail();
        String accessToken = jwtUtil.generateAccessToken(email, authorities);
        String refreshToken = jwtUtil.generateRefreshToken(email, authorities);
        cookieGenerateHelper.generateCookieToResponse("access_token", accessToken, access_token_expiration/1000, true, response);
        cookieGenerateHelper.generateCookieToResponse("refresh_token", refreshToken, refresh_token_expiration/1000, true, response);
        cookieGenerateHelper.clearOauthStateInCookie(request, response);
    }


}
