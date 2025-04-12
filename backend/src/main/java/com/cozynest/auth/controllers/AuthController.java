package com.cozynest.auth.controllers;

import com.cozynest.auth.dtos.*;
import com.cozynest.auth.entities.AuthProvider;
import com.cozynest.auth.entities.ShopUserUserType;
import com.cozynest.auth.services.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    RegistrationService registrationService;

    @Autowired
    VerifyEmailService verifyEmailService;

    @Autowired
    LogoutService logoutService;

    @Autowired
    LoginService loginService;

    @Autowired
    PasswordService passwordService;

    @Autowired
    AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody RegistrationRequest request, HttpServletResponse httpResponse) {
        RegistrationResponse response = registrationService.createUser(request, httpResponse, AuthProvider.MANUAL);
        return new ResponseEntity<>(response.getMessage(), HttpStatus.valueOf(response.getCode()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        return loginService.login(loginRequest.getEmail(), loginRequest.getPassword(), request, response, AuthProvider.MANUAL);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        logoutService.logout(response);
        return new ResponseEntity<>("Logged out successfully", HttpStatusCode.valueOf(200));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> register(@Valid @RequestBody VerifyEmailRequest verifyEmailRequest, HttpServletResponse response) {
        return verifyEmailService.isVerifyEmailSuccess(verifyEmailRequest, response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        return passwordService.changePassword(changePasswordRequest, ShopUserUserType.CLIENT);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody SendVerificationCodeRequest verificationCodeRequest) {
        return passwordService.requestVerificationCode(verificationCodeRequest.getEmail());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        return passwordService.resetPassword(resetPasswordRequest);
    }

    @GetMapping("/checkLogin")
    public ResponseEntity<?> checkLogin(HttpServletRequest request, HttpServletResponse response) {
        Boolean isLogin = authService.checkIsLoginOrNot(request, response);
        return ResponseEntity.ok(Map.of("isLogin", isLogin));
    }
}
