package com.cozynest.dtos;

import lombok.Data;

import java.util.UUID;

@Data
public class ReviewRequest {
    private Float rating;
    private String comments;
}
