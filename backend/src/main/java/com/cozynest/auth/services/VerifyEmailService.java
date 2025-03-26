package com.cozynest.auth.services;

import com.cozynest.auth.dtos.VerifyEmailRequest;
import com.cozynest.auth.entities.AuthAuthority;
import com.cozynest.auth.entities.AuthProvider;
import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.entities.Verification;
import com.cozynest.auth.helper.CookieGenerateHelper;
import com.cozynest.auth.helper.JwtUtil;
import com.cozynest.auth.repositories.ClientRepository;
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
public class VerifyEmailService {

    @Autowired
    private ShopUserRepository shopUserRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieGenerateHelper cookieGenerateHelper;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Value("${jwt.access_token.expiration_time}")
    private int access_token_expiration;

    @Value("${jwt.refresh_token.expiration_time}")
    private int refresh_token_expiration;

    @Autowired
    private ClientRepository clientRepository;

    public ResponseEntity<?> isVerifyEmailSuccess(VerifyEmailRequest verifyEmailRequest, HttpServletResponse response) {
        String email = verifyEmailRequest.getEmail();
        String code = verifyEmailRequest.getCode();

        ShopUser user = shopUserRepository.findByEmail(email);

        if (user == null) {
            return new ResponseEntity<>("Email has not been registered", HttpStatus.NOT_FOUND);
        }

        Set<AuthProvider> registeredProviders = user.getClient().getClientProviders().stream()
                .map(cp -> cp.getId().getAuthProvider())
                .collect(Collectors.toSet());
        if (!registeredProviders.contains(AuthProvider.MANUAL)) {
            return new ResponseEntity<>("This account was not registered via manual email/password. Verification is not applicable here.", HttpStatus.NOT_FOUND);
        }

        if (user.getIsVerified()) {
            return new ResponseEntity<>("Email has already been verified", HttpStatus.ALREADY_REPORTED);
        }

        Verification verification = user.getVerification();
        if (verification == null) {
            return new ResponseEntity<>("Verification code not found. Please request a new one.", HttpStatus.NOT_FOUND);
        }

        boolean isCodeMatch = isCodeMatch(code, verification);
        boolean isCodeExpire = isCodeExpire(verification);

        /* 1. code true, not expire
           2. code true, expire
           3. code wrong              */
        if (isCodeMatch && !isCodeExpire) {
            generateTokenToCookie(email, response, user);
            user.setIsVerified(true);
            return new ResponseEntity<>("Verified successfully", HttpStatus.OK);
        } else if (isCodeMatch && isCodeExpire) {
            return new ResponseEntity<>("Verification Code expire, please request a new one.", HttpStatus.GONE);
        } else {
            return new ResponseEntity<>("Invalid verification code or email.", HttpStatus.BAD_REQUEST);
        }
    }

    public boolean isCodeMatch(String code, Verification verification) {
        return bCryptPasswordEncoder.matches(code, verification.getCode());
    }

    public boolean isCodeExpire(Verification verification) {
        return verification.getExpiresAt().isBefore(LocalDateTime.now());
    }

    public void generateTokenToCookie(String email, HttpServletResponse response, ShopUser user) {
        Set<AuthAuthority> authAuthorities = user.getAuthorities();
        List<String> authorities = authAuthorities.stream()
                .map(authAuthority -> authAuthority.getRoleCode()).collect(Collectors.toList());
        String accessToken = jwtUtil.generateAccessToken(email, authorities);
        String refreshToken = jwtUtil.generateRefreshToken(email, authorities);
        cookieGenerateHelper.generateCookieToResponse("access_token", accessToken, access_token_expiration/1000, true, response);
        cookieGenerateHelper.generateCookieToResponse("refresh_token", refreshToken, refresh_token_expiration/1000, true, response);
    }
}
