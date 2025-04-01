package com.cozynest.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotEmpty(message = "Order Cart Items List cannot be empty.")
    private List<OrderCartItemDto> orderCartItemDtoList;

    private String DiscountCode;

    @NotNull(message = "Shipping info cannot be blank.")
    private ShippingInfoDto shippingInfoDto;

    @NotBlank(message = "Delivery method cannot be blank.")
    @Pattern(regexp = "STANDARD|EXPRESS", message = "Delivery method must be STANDARD or EXPRESS.")
    private String deliveryMethod;

}
