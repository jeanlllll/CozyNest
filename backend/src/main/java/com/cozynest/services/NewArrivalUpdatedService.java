package com.cozynest.services;

import com.cozynest.entities.products.product.Product;
import com.cozynest.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewArrivalUpdatedService {

    @Autowired
    ProductRepository productRepository;

    @Scheduled(cron = "0 0 0 * * ?") //run at midnight (0.00) every day
    public void updateProductIsNewArrivalStatus() {
        List<Product> productList = productRepository.findByIsNewArrival(true);
        for (Product product : productList) {
            if (product.getCreatedOn().isAfter(LocalDateTime.now().minusDays(7))) {
                product.setIsNewArrival(false);
            }
        }
    }
}
