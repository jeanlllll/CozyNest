package com.cozynest.dtos;

import com.cozynest.entities.products.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private UUID productId;
    private Float price;
    private String name;
    private String description;
    private Float avgRating;
    private Boolean isNewArrival;
    private CategoryDto categoryDto;
    private CategoryTypeDto categoryTypeDto;
    private List<ProductVariantDto> productVariantDtoList;
    private List<ProductDisplayDto> productDisplayDtoList;
    private List<ProductMaterialDto> productMaterialDtoList;
    private List<ProductDto> guessYouLikeList;
    private List<ReviewDto> reviewList;


}
