package com.cozynest.controllers;

import com.cozynest.auth.dtos.RegistrationRequest;
import com.cozynest.auth.dtos.RegistrationResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product")
@CrossOrigin
public class Product {

    @GetMapping
    public ResponseEntity<String> getProduct() {
        return new ResponseEntity<>("sucess", HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<String> postProduct() {
        return new ResponseEntity<>("added", HttpStatus.OK);
    }
}
