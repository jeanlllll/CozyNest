package com.cozynest.auth.controllers;

import com.cozynest.auth.dtos.*;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.entities.ClientProvider;
import com.cozynest.auth.services.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String loginType, @Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        if (loginType.equals("manual")) {
            return loginService.login(loginRequest.getEmail(), loginRequest.getPassword(), response, ClientProvider.MANUAL);
        }
        return new ResponseEntity<>("Invalid loginType", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = registrationService.createUser(request, ClientProvider.MANUAL);
        return new ResponseEntity<>(response.getMessage(), HttpStatus.valueOf(response.getCode()));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> register(@Valid @RequestBody VerifyEmailRequest verifyEmailRequest, HttpServletResponse response) {
        return verifyEmailService.isVerifyEmailSuccess(verifyEmailRequest, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        logoutService.logout(response);
        return new ResponseEntity<>("Logged out successfully", HttpStatusCode.valueOf(200));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        return passwordService.changePassword(changePasswordRequest);
    }

    @PostMapping("forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody String email) {
        return passwordService.requestVerificationCode(email);
    }

    @PostMapping("reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        return passwordService.resetPassword(resetPasswordRequest);
    }
}
