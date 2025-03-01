package com.cozynest.auth.controllers;

import com.cozynest.auth.dts.RegistrationRequest;
import com.cozynest.auth.dts.RegistrationResponse;
import com.cozynest.auth.services.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    RegistrationService registrationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = registrationService.createUser(request);
        return new ResponseEntity<>(response.getMessage(), HttpStatus.valueOf(response.getCode()));
    }
}
