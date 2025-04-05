package com.cozynest.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {

    UUID orderId;
    LocalDate orderDate;
    String orderStatus;
    String trackingNumber;
    LocalDate shippingDate;
    List<OrderProductDto> orderProductDtoList;

    String receiver;
    String phoneNumber;
    String shippingAddress;
    String paymentMethod;
    String paymentStatus;
    LocalDate paymentDate;
    String shippingMethod;

    float originalPrice;
    float promotionPrice;
    String discountCodeUsed;
    float discountPrice;
    float transportationPrice;
    float totalPrice;

}
