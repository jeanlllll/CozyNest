package com.cozynest.dtos;

import com.cozynest.entities.products.materials.MaterialTranslationId;
import com.cozynest.entities.products.product.ProductMaterial;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductMaterialDto {

    private String translatedName;
    private Integer percentage;
}
