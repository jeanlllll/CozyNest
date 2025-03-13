package com.cozynest.dtos;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class CategoryProductDto {

    private UUID productId;
    private String productName;
    private Float productPrice;
    private List<ProductDisplayDto> productDisplayDtoList = new ArrayList<>();
}
