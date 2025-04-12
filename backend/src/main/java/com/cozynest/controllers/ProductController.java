package com.cozynest.controllers;

import com.cozynest.Helper.CheckAuthenticationHelper;
import com.cozynest.auth.dtos.ReviewPostResponse;
import com.cozynest.dtos.*;
import com.cozynest.entities.products.product.Product;
import com.cozynest.repositories.ProductRepository;
import com.cozynest.services.ProductService;
import com.cozynest.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    ReviewService reviewService;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CheckAuthenticationHelper checkAuthenticationHelper;

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable UUID productId,
            @RequestHeader(value ="Accept-Language", defaultValue="en") String languageCode) {

        ProductResponse productResponse = productService.getProductDetailsById(productId, languageCode);
        return ResponseEntity.ok().body(productResponse);
    }

    /*----------------------------product in category page------------------------------------------*/

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<ProductDto>> getProductByCategory(
            @PathVariable String category,
            @RequestParam(value = "page", required = true) int page,
            @RequestParam(value = "size", required = false, defaultValue = "9") int pageSize,

            //sorting: only one of these can be true
            @RequestParam(value = "sortByArrivalDateDesc", required = false) Boolean sortByArrivalDate,
            @RequestParam(value = "sortByPriceAsc", required = false) Boolean priceAsc,
            @RequestParam(value = "sortByPriceDesc", required = false) Boolean priceDesc,
            @RequestParam(value = "sortByRatingDesc", required = false) Boolean sortByRating,

            //filtering parameters
            @RequestParam(value = "keywords", required = false) String keywords,
            @RequestParam(value = "categoryTypes", required = false) List<String> categoryTypes,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false)  Double maxPrice,
            @RequestParam(value = "sizes", required = false) List<String> sizes) {

        // Validate: Only one sorting flag may be true
        int sortCount = (Boolean.TRUE.equals(sortByArrivalDate) ? 1 : 0) +
                        (Boolean.TRUE.equals(priceAsc) ? 1 : 0) +
                        (Boolean.TRUE.equals(priceDesc) ? 1 : 0) +
                        (Boolean.TRUE.equals(sortByRating) ? 1 : 0);
        if (sortCount > 1) {
            return ResponseEntity.badRequest().body(null);
        }

        // Determine sorting flag (if none is true, the service will use the default)
        String sortBy = null;
        if (Boolean.TRUE.equals(priceAsc)) sortBy = "priceAsc";
        else if (Boolean.TRUE.equals(priceDesc)) sortBy = "priceDesc";
        else if (Boolean.TRUE.equals(sortByRating)) sortBy = "avgRatingDesc";
        else if (Boolean.TRUE.equals(sortByArrivalDate)) sortBy = "createdOnDesc";

        // call service layer
        Page<ProductDto> products = productService.getFilteredProducts(
                category, page, pageSize, sortBy, keywords, categoryTypes, minPrice, maxPrice, sizes);
        return ResponseEntity.ok(products);
    }

    /*----------------------------------review------------------------------------------*/
    @PostMapping("/{productId}/review")
    public ResponseEntity<ReviewPostResponse> postReview(@PathVariable UUID productId,
                                                         @RequestBody ReviewRequest reviewRequest) throws Exception {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        Page<ReviewDto> reviewDtoPage = reviewService.postReview(productId, reviewRequest, userId);
        Product product = productRepository.findById(productId).get();
        Float avgRating = product.getAvgRating();
        Integer reviewCount = product.getReviewCount();
        ReviewPostResponse reviewPostResponse = ReviewPostResponse.builder()
                .reviewDtoPage(reviewDtoPage)
                .avgRating(avgRating)
                .reviewCount(reviewCount)
                .build();
        return ResponseEntity.ok(reviewPostResponse);
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


}
