package com.cozynest.services;

import com.cozynest.dtos.PaymentDto;
import com.cozynest.entities.orders.payment.Payment;
import com.cozynest.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepository;

    public PaymentDto getPaymentStatus(String sessionId) {
        Payment payment = paymentRepository.findBySessionId(sessionId);
        if (payment.getSessionId() == null) {
            System.out.println("Session Id not found");
        }
        return PaymentDto.builder()
                .orderId(payment.getOrder().getId())
                .paymentIntentId(payment.getPaymentIntentId())
                .paymentStatus(String.valueOf(payment.getPaymentStatus()))
                .build();
    }
}
