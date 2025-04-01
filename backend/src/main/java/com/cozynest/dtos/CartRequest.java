package com.cozynest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CartRequest {

    @NotNull(message = "ProductId cannot be blank")
    private UUID productId;

    @NotNull(message = "ProductVariantId cannot be blank")
    private UUID productVariantId;

}
