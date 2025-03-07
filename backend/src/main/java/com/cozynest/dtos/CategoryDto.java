package com.cozynest.dtos;

import com.cozynest.entities.products.Category;
import lombok.Data;

import java.util.UUID;

@Data
public class CategoryDto {

    private UUID id;
    private String name;
    private String code;

    public CategoryDto(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.code = category.getCode();
    }
}
