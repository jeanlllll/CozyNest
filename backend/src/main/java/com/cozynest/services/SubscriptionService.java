package com.cozynest.services;

import com.cozynest.dtos.SubscriptionRequest;
import com.cozynest.entities.subscription.Subscription;
import com.cozynest.entities.subscription.SubscriptionStatus;
import com.cozynest.repositories.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SubscriptionService {

    @Autowired
    SubscriptionRepository subscriptionRepository;

    public ResponseEntity<?> addToSubscription(SubscriptionRequest subscriptionRequest) {
        String email = subscriptionRequest.getEmail();
        //if email is null
        if (email == null ||  email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email cannot be blank.");
        }
        //if email already subscribed
        Subscription subscription = subscriptionRepository.findByEmail(email);
        if (subscriptionRepository.findByEmail(email) != null && subscription.getStatus().equals(SubscriptionStatus.ACTIVE)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already subscribed.");
        }
        //email not null or subscribed, subscript now.
        if (subscription == null) {
            subscription = new Subscription();
        }
        subscription.setEmail(email);
        subscription.setSubscriptionDate(LocalDateTime.now());
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setUnsubscriptionDate(null);
        subscriptionRepository.save(subscription);
        return ResponseEntity.ok().body("Email subscribed successfully.");
    }

    public ResponseEntity<?> removeFromSubscription(SubscriptionRequest subscriptionRequest) {
        String email = subscriptionRequest.getEmail();
        //if email is null
        if (email == null ||  email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email cannot be blank.");
        }
        // if email has not been subscribed
        Subscription subscription = subscriptionRepository.findByEmail(email);
        if (subscription == null) {
            return ResponseEntity.badRequest().body("Email has not subscribed yet.");
        }
        if (subscription.getStatus().equals(SubscriptionStatus.INACTIVE)) {
            return ResponseEntity.badRequest().body("Email already unsubscribed.");
        }
        subscription.setStatus(SubscriptionStatus.INACTIVE);
        subscription.setUnsubscriptionDate(LocalDateTime.now());
        subscriptionRepository.save(subscription);
        return ResponseEntity.ok().body("Email unsubscribed successfully.");
    }


}
