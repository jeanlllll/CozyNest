package com.cozynest.repositories;

import com.cozynest.entities.products.product.ProductDisplay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductDisplayRepository extends JpaRepository<ProductDisplay, UUID> {
}
