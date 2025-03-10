package com.cozynest.dtos;

import com.cozynest.entities.products.product.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {

    private UUID cartItemId;
    private UUID productId;
    private List<ProductTranslationDto> productTranslationDtoList;
    private Float productPrice;
    private String category;
    private String categoryType;
    private ProductVariantDto ProductVariantDto;
    private Integer quantity;
    private ProductDisplayDto primaryProductDisplayDto;
}
