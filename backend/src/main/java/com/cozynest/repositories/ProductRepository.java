package com.cozynest.repositories;

import com.cozynest.entities.products.product.Product;
import com.cozynest.entities.products.product.ProductTranslation;
import com.cozynest.entities.products.product.ProductVariant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    //even though there are 2 rows with same price for the same p.id, it would only get the first based on the group
    @Query(
            """
                SELECT p.id, min(p.price), p.avgRating
                FROM Product p
                LEFT JOIN p.productVariants pv
                LEFT JOIN p.productTranslationList pt
                WHERE p.category.id = :categoryId
                  AND (:#{#categoryTypeIds == null or #categoryTypeIds.isEmpty()} = true OR p.categoryType.id IN (:categoryTypeIds))
                  AND p.isOutOfStock = false
                  AND (:minPrice IS NULL OR p.price >= :minPrice)
                  AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                  AND (:#{#sizes == NULL or #sizes.isEmpty()} = true OR  pv.size IN :sizes)
                  AND (:#{#keywords == NULL} = true OR
                    (LOWER(pt.name) LIKE CONCAT('%', :keywords, '%') OR LOWER(pt.description) LIKE CONCAT('%', :keywords, '%')))
                GROUP BY p.id
             """
    )
    Page<Object[]> findByFilters(
            @Param("categoryId") UUID categoryId,
            @Param("categoryTypeIds") List<UUID> categoryTypeIds,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("sizes") List<String> sizes,
            @Param("keywords") String keywords,
            Pageable pageable);


    List<Product> findByIsNewArrival(Boolean status);


    @Query("""
        SELECT p
        FROM Product p
        WHERE p.category.id = :categoryId
        ORDER BY p.createdOn DESC
    """)
    Page<Product> findByCategoryNOrderByCreatedDate(@Param("categoryId") UUID categoryId, Pageable pageable);
}
