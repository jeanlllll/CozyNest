package com.cozynest.dtos;
import lombok.Data;

import java.util.UUID;

@Data
public class OrderProductDto {

    private UUID productId;
    private UUID productVariantId;
    private Integer quantity;

}
