package com.cozynest.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteItemDto {

    private UUID productId;
    private List<ProductTranslationDto> productTranslationDtoList;
    private float price;
    private Boolean isOutOfStock;
    private List<ProductDisplayDto> ProductDisplayDto;
    private LocalDateTime addDateTime;
}
