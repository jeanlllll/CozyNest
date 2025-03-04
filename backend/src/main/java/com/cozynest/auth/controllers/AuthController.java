package com.cozynest.auth.controllers;

import com.cozynest.auth.dtos.RegistrationRequest;
import com.cozynest.auth.dtos.RegistrationResponse;
import com.cozynest.auth.services.RegistrationService;
import com.cozynest.auth.services.VerifyEmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    RegistrationService registrationService;

    @Autowired
    VerifyEmailService verifyEmailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = registrationService.createUser(request);
        return new ResponseEntity<>(response.getMessage(), HttpStatus.valueOf(response.getCode()));
    }

//    @PostMapping("/verify-email")
//    public ResponseEntity<?> register(@RequestParam String email, @RequestParam String code) {
//        Boolean isVerified = verifyEmailService.VerifyEmail(email, code);
//        return new ResponseEntity<>(response.getMessage(), HttpStatus.valueOf(response.getCode()));
//    }
}
