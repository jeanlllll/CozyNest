package com.cozynest.auth.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${Stripe.apiKey}")
    private String stripeApiKey;

    @PostConstruct
    public void initializeStripe() {
        Stripe.apiKey = stripeApiKey;
    }
}
