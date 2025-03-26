package com.cozynest.dtos;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class ProductDto {

    private UUID productId;
    private List<ProductTranslationDto> productTranslationDtoList = new ArrayList<>();
    private Float productPrice;
    private List<ProductDisplayDto> productDisplayDtoList = new ArrayList<>();

}
