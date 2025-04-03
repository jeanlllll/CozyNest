package com.cozynest.controllers;

import com.cozynest.dtos.PaymentDto;
import com.cozynest.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<PaymentDto> getPaymentStatusBySessionId(@PathVariable String sessionId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(sessionId));
    }

}
