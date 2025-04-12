package com.cozynest.controllers;

import com.cozynest.dtos.SubscriptionRequest;
import com.cozynest.services.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    @Autowired
    SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody SubscriptionRequest subscriptionRequest) {
        return subscriptionService.addToSubscription(subscriptionRequest.getEmail());
    }

    @PutMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@Valid @RequestBody SubscriptionRequest subscriptionRequest) {
        return subscriptionService.removeFromSubscription(subscriptionRequest);
    }

}
