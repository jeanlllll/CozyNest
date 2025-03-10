package com.cozynest.controllers;

import com.cozynest.dtos.ApiResponse;
import com.cozynest.dtos.ProductResponse;
import com.cozynest.dtos.ReviewDto;
import com.cozynest.dtos.ReviewRequest;
import com.cozynest.services.ProductService;
import com.cozynest.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    ReviewService reviewService;

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable UUID productId,
            @RequestHeader(value ="Accept-Language", defaultValue="en") String languageCode) {

        ProductResponse productResponse = productService.getProductDetailsById(productId, languageCode);
        return ResponseEntity.ok().body(productResponse);
    }

    /*----------------------------------review------------------------------------------*/
    @PostMapping("/{productId}/review")
    public ResponseEntity<String> postReview(@PathVariable UUID productId,
                                             @RequestBody ReviewRequest reviewRequest) {
        ApiResponse apiResponse = reviewService.postReview(productId, reviewRequest);
        return ResponseEntity.status(apiResponse.getStatus()).body(apiResponse.getMessage());
    }

    @GetMapping("/{productId}/review/{reviewId}")
    public ResponseEntity<ReviewDto> postReview(@PathVariable UUID productId,
                                             @PathVariable UUID reviewId) {
        ReviewDto reviewDto = reviewService.getReviewById(productId, reviewId);
        return ResponseEntity.ok().body(reviewDto);
    }

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable UUID productId,
                                                     @RequestParam(name="page", required = true) int page,
                                                     @RequestParam(name="size", required = true) int size,
                                                     @RequestParam(name="sortBy", defaultValue = "createdOn") String sortBy,
                                                     @RequestParam(name="desc", defaultValue = "true") Boolean isDesc) {
        Page<ReviewDto> reviewPage = reviewService.getPaginatedReviews(productId, page, size, sortBy, isDesc);
        return ResponseEntity.ok().body(reviewPage.getContent());
    }
    /*---------------------------------------------------------------------------------*/

}
