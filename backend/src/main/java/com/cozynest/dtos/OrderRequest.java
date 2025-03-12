package com.cozynest.dtos;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    List<OrderProductDto> productDtoList;
    String DiscountCode;
    private ShippingInfoDto shippingInfoDto;
    private String deliveryMethod;
    private String paymentMethod;
}
