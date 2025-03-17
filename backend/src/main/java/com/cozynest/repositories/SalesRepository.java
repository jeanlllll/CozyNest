package com.cozynest.repositories;

import com.cozynest.entities.Sales;
import com.cozynest.entities.products.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface SalesRepository extends JpaRepository<Sales, UUID> {

    @Query("""
        SELECT s
        FROM Sales s
        JOIN FETCH s.product p
        LEFT JOIN FETCH p.productTranslationList pt
        WHERE s.saleDate >= :saleDate
        AND s.category.id = :categoryId
        GROUP BY s.id, p.id, pt.id
        ORDER BY SUM(s.saleAmount * s.quantity) DESC
    """)
    Page<Sales> findTopSellingProductsIdByCategory(@Param("saleDate")LocalDateTime saleDate,
                                         @Param("categoryId")UUID categoryId,
                                         Pageable pageable);
}
