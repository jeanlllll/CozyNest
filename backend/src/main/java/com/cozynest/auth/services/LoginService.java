package com.cozynest.auth.services;

import com.cozynest.auth.dtos.LoginRequest;
import com.cozynest.auth.entities.AuthAuthority;
import com.cozynest.auth.entities.ClientProvider;
import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.helper.CookieGenerateHelper;
import com.cozynest.auth.helper.JwtUtil;
import com.cozynest.auth.repositories.ShopUserRepository;
import jakarta.servlet.http.HttpServletResponse;
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

    public ResponseEntity<?> login(String email, String password, HttpServletResponse response, ClientProvider clientProvider) {
        ShopUser user = shopUserRepository.findByEmail(email);

        // 1. if user not exist in database, maybe deleted, but still with valid jwt
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }

//        // 2. if user's actual provider does not match this incoming provider, we link their account;
//        Set<ClientProvider> storedProvider = user.getClient().getClientProviders();
//        if (!storedProvider.contains("GOOGLE")) {
//            return new ResponseEntity<>("We found an existing account with this email. Do you want to link Google sign-in?", HttpStatus.CONFLICT);
//        }

        // 2. user not verify
        if (!user.getIsVerified()) {
            return new ResponseEntity<>("Please verify your email first", HttpStatus.FORBIDDEN);
        }

        //only loginType is manual has password, for Google oauth2 login, no need password
        if (clientProvider.equals(ClientProvider.MANUAL)) {
            // 3. reset failed attempts daily (even if not locked)
            if (!user.getIsLocked() && user.getLastLoginAttemptsDate() != null && !user.getLastLoginAttemptsDate().toLocalDate().equals(LocalDateTime.now().toLocalDate())) {
                user.setLoginFailedAttempts(0);
                shopUserRepository.save(user);
            }

            // 4.  Account is Locked & Still Within Lock Time > Do Nothing
            if (user.getIsLocked() && user.getLockExpiresAt().isAfter(LocalDateTime.now())) {
                return new ResponseEntity<>("Too many failed attempts. Your account is locked until " + user.getLockExpiresAt(), HttpStatus.FORBIDDEN);
            }

            // 5. Account is Locked & Lock Time Expired > Unlock
            if (user.getIsLocked() && user.getLockExpiresAt().isBefore(LocalDateTime.now())) {
                user.setIsLocked(false);
                user.setLoginFailedAttempts(0);
                user.setLockExpiresAt(null);
                user.setLastLoginAttemptsDate(null);
                shopUserRepository.save(user);
            }

            // 6. password incorrect
            if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
                user.setLoginFailedAttempts(user.getLoginFailedAttempts() + 1);
                user.setLastLoginAttemptsDate(LocalDateTime.now());

                // 7. Login Failed MAX_FAILED_ATTEMPTS Times > Lock the Account
                if (user.getLoginFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
                    user.setIsLocked(true);
                    user.setLockExpiresAt(LocalDateTime.now().plusHours(LOCK_DURATION_HOURS));
                    shopUserRepository.save(user);
                    return new ResponseEntity<>("Too many failed attempts. Your account is locked for " + LOCK_DURATION_HOURS + " hours.", HttpStatus.FORBIDDEN);
                }

                shopUserRepository.save(user);
                return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
            }

            // 8. successfully login > reset failed attempts & unlock account
            user.setLockExpiresAt(null);
            user.setIsLocked(false);
            user.setLoginFailedAttempts(0);
            user.setLastLoginAttemptsDate(null);
            shopUserRepository.save(user);
        }


        // generate access token and refresh token and add it to cookies
        Set<AuthAuthority> authAuthorities = user.getAuthorities();
        List<String> authorities = authAuthorities.stream()
                .map(authAuthority -> authAuthority.getRoleCode()).collect(Collectors.toList());

        String accessToken = jwtUtil.generateAccessToken(email, authorities);
        String refreshToken = jwtUtil.generateRefreshToken(email, authorities);
        cookieGenerateHelper.generateCookieToResponse("access_token", accessToken, access_token_expiration/1000, true, response);
        cookieGenerateHelper.generateCookieToResponse("refresh_token", refreshToken, refresh_token_expiration/1000, true, response);

        return new ResponseEntity<>("Login successfully", HttpStatus.OK);
    }


}
