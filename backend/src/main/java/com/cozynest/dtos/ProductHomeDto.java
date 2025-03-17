package com.cozynest.dtos;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class ProductHomeDto {

    private UUID productId;
    private List<ProductTranslationDto> productTranslattionDtoList = new ArrayList<>();
    private Float productPrice;
    private List<ProductDisplayDto> productDisplayDtoList = new ArrayList<>();

}
