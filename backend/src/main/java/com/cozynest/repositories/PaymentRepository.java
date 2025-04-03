package com.cozynest.repositories;

import com.cozynest.entities.orders.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Payment findBySessionId(String sessionId);
}
