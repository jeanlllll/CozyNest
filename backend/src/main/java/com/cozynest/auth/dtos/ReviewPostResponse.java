package com.cozynest.auth.dtos;

import com.cozynest.dtos.ReviewDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewPostResponse {

    Page<ReviewDto> reviewDtoPage;
    Float avgRating;
    Integer reviewCount;
}
