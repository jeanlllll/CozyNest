package com.cozynest.auth.controllers;

import com.cozynest.services.OrderService;
import com.stripe.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/webhook")
public class WebhookController {

    @Autowired
    OrderService orderService;

    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        ResponseEntity<String>  response = orderService.handleStripeWebhook(payload, sigHeader);
        return response;
    }
} 