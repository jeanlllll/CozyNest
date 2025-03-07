package com.cozynest.dtos;

import com.cozynest.entities.products.product.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDto {

    private UUID id;
    private String color;
    private String size;
    private Integer stockQuantity;
    private Character gender;

    public ProductVariantDto(ProductVariant productVariant) {
        this.id = productVariant.getId();
        this.color = productVariant.getColor();
        this.size = productVariant.getSize();
        this.stockQuantity = productVariant.getStockQuantity();
        this.gender = productVariant.getGender();
    }
}
