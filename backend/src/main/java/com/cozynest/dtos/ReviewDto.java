package com.cozynest.dtos;

import com.cozynest.entities.products.Review;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class ReviewDto {

    private UUID id;
    private Float rating;
    private String userName;
    private String comment;
    private LocalDate createdOn;

    public ReviewDto(Review review, String userName) {

        this.id = review.getId();
        this.rating = review.getRating();
        this.userName = userName;
        this.comment = review.getComment();
        this.createdOn = review.getCreatedOn();
    }

}
