package com.cozynest.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderProductDto {

    UUID productId;
    List<ProductTranslationDto> productTranslationDtoList = new ArrayList<>();
    ProductDisplayDto productDisplayDto;
    String color;
    Character gender;
    String size;
    int quantity;
    float productTotalPrice;
}
