package com.cozynest.dtos;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class OrderProductDto {

    @NotBlank(message = "Product Id cannot be blank.")
    private UUID productId;

    @NotBlank(message = "Product Variant Id cannot be blank.")
    private UUID productVariantId;

    @NotBlank(message = "Quantity cannot be blank.")
    @Min(value = 1, message = "Quantity must be at least 1.")
    private Integer quantity;

}
