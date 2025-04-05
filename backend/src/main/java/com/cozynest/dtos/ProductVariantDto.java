package com.cozynest.dtos;

import com.cozynest.entities.products.product.ProductDisplay;
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
    private Character gender;
    private UUID productDisplayId;
    private Boolean isAvailable;

    public ProductVariantDto(ProductVariant productVariant) {
        this.id = productVariant.getId();
        this.color = productVariant.getColor();
        this.size = productVariant.getSize();
        if (productVariant.getStockQuantity() > 0) {
            isAvailable = true;
        } else {
            isAvailable = false;
        }
        this.gender = productVariant.getGender();
        this.productDisplayId = productVariant.getProductDisplay().getId();
    }

}
