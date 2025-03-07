package com.cozynest.repositories;

import com.cozynest.entities.subscription.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    // log N
    Subscription findByEmail(String email);
}
