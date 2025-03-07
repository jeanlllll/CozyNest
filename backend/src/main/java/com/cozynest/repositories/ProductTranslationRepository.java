package com.cozynest.repositories;

import com.cozynest.entities.products.product.ProductTranslation;
import com.cozynest.entities.products.product.ProductTranslationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductTranslationRepository extends JpaRepository<ProductTranslation, ProductTranslationId> {
}
