package com.cozynest.controllers;

import com.cozynest.services.WebhookService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhook")
public class WebhookController {

    @Autowired
    WebhookService webhookService;

    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) throws StripeException {
        ResponseEntity<String>  response = webhookService.handleStripeWebhook(payload, sigHeader);
        return response;
    }
} 