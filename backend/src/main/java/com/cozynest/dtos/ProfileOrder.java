package com.cozynest.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileOrder {

    UUID orderId;
    LocalDate orderDate;
    String orderStatus;
    String paymentStatus;
    LocalDate paymentDate;
    float totalPrice;
}
