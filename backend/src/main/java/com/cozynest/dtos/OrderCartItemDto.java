package com.cozynest.dtos;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class OrderCartItemDto {

    @NotBlank(message = "Cart item Id cannot be blank.")
    private UUID cartItemId;

    @NotBlank(message = "Quantity cannot be blank.")
    @Min(value = 1, message = "Quantity must be at least 1.")
    private Integer quantity;

}
