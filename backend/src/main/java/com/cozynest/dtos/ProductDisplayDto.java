package com.cozynest.dtos;

import com.cozynest.entities.products.product.ProductDisplay;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDisplayDto {

    private UUID id;
    private String url;
    private String type;
    private Boolean isPrimary;

    public ProductDisplayDto(ProductDisplay productDisplay) {
        this.id = productDisplay.getId();
        this.url = productDisplay.getUrl();
        this.type = productDisplay.getType();
        this.isPrimary = productDisplay.getIsPrimary();
    }
}
