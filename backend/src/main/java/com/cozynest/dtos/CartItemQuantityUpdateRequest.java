package com.cozynest.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class CartItemQuantityUpdateRequest {

    @NotBlank(message = "Quantity cannot be blank.")
    Integer quantity;
}
