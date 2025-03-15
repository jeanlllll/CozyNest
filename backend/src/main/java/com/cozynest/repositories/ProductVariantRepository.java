package com.cozynest.repositories;

import com.cozynest.entities.products.product.ProductVariant;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT pv from ProductVariant pv where pv.id = :id")
    ProductVariant findByIdForUpdate(@Param("id") UUID id);
}
