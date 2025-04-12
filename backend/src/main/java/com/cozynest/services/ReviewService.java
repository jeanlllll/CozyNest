package com.cozynest.services;

import com.cozynest.Exceptions.ProductNotFoundException;
import com.cozynest.auth.entities.AuthProvider;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.entities.ClientProvider;
import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.dtos.ApiResponse;
import com.cozynest.dtos.ReviewDto;
import com.cozynest.dtos.ReviewRequest;
import com.cozynest.entities.products.Review;
import com.cozynest.entities.products.product.Product;
import com.cozynest.repositories.ProductRepository;
import com.cozynest.repositories.ReviewRepository;
import jakarta.transaction.Transactional;
import org.hibernate.annotations.NotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReviewService {

    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ShopUserRepository shopUserRepository;

    public Page<ReviewDto> getPaginatedReviews(UUID productId, int page, int size, String sortedBy, Boolean isDesc) {
        Pageable pageable;
        if (isDesc) {
            pageable = PageRequest.of(page, size, Sort.by(sortedBy).descending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by(sortedBy).ascending());
        }
        Page<Review> reviewsPage = reviewRepository.findByProductId(productId, pageable);
        return reviewsPage.map(review -> {
            ShopUser shopUser = review.getClient().getShopUser();
            String fistName = shopUser.getFirstName();
            String lastName = shopUser.getLastName();
            String fullName = fistName + " " + lastName;
            return new ReviewDto(review, fullName);
        });
    }

    @Transactional
    public Page<ReviewDto> postReview(UUID productId, ReviewRequest reviewRequest, UUID userId) throws Exception {
        Float rating = reviewRequest.getRating();
        if (rating > 5.0 || rating <= 0) {
            throw new Exception("Rating must be between 0.1 and 5.0");
        }

        String comment = reviewRequest.getComments();
        if (comment.length() > 300) {
            throw new Exception("Comments cannot exceed 300 characters");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product Id cannot found"));
        Client client = clientRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        ShopUser shopUser = shopUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        boolean isManualRegister = client.getClientProviders().contains(AuthProvider.MANUAL);
        if (!shopUser.getIsVerified() && isManualRegister) {
            throw new Exception("Please verify email first.");
        }

        Review review = new Review();
        Float newRating = reviewRequest.getRating();
        review.setRating(newRating);
        review.setComment(reviewRequest.getComments());
        review.setProduct(product);
        review.setClient(client);
        review.setCreatedOn(LocalDate.now());
        reviewRepository.save(review);

        int oldReviewCount = product.getReviewCount();
        Float newAvgRating = countNewAvgRating(oldReviewCount, newRating, product);
        product.setReviewCount(oldReviewCount+1);
        product.setAvgRating(newAvgRating);
        productRepository.save(product);

        return getPaginatedReviews(productId, 0, 3, "createdOn", true);
    }

    public ReviewDto getReviewById(UUID productId, UUID reviewId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product Id cannot found."));
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review id cannot found."));
        Client client = review.getClient();
        ShopUser user = shopUserRepository.findById(client.getId())
                .orElseThrow(() -> new RuntimeException("User cannot found"));
        String fullName = user.getFirstName() + " " + user.getLastName();
        return new ReviewDto(review, fullName);
    }


    private float countNewAvgRating(int oldReviewCount, float newRating, Product product) {
        float oldAvgRating = product.getAvgRating();
        float newReviewCount = oldReviewCount + 1;
        return (oldReviewCount * oldAvgRating + newRating) / newReviewCount;
    }
}
