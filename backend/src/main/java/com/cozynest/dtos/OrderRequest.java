package com.cozynest.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotEmpty(message = "Product cannot be empty.")
    @Size(min = 1, max = 100, message = "Product sizes should be between 1 to 100.")
    private List<OrderProductDto> productDtoList;

    private String DiscountCode;

    @NotNull(message = "Shipping info cannot be blank.")
    private ShippingInfoDto shippingInfoDto;

    @NotBlank(message = "Delivery method cannot be blank.")
    @Pattern(regexp = "STANDARD|EXPRESS", message = "Delivery method must be STANDARD or EXPRESS.")
    private String deliveryMethod;

}
