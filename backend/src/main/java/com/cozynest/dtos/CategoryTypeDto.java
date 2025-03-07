package com.cozynest.dtos;

import com.cozynest.entities.products.categoryType.CategoryType;
import lombok.Data;

import java.util.UUID;

@Data
public class CategoryTypeDto {

    private UUID id;
    private String name;
    private String code;

    public CategoryTypeDto(CategoryType categoryType) {
        this.id = categoryType.getId();
        this.name = categoryType.getName();
        this.code = categoryType.getCode();
    }
}
