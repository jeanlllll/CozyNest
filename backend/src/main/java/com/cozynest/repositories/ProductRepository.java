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


    @Query("""
            SELECT DISTINCT p.id, p.price, pt.name
            FROM Product p
            LEFT JOIN p.productVariants pv
            LEFT JOIN p.productTranslationList pt
            WHERE p.category.id = :categoryId
              AND pt.id.languageId = :languageId
              AND (:#{#categoryTypeIds == null or #categoryTypeIds.isEmpty()} = true OR p.categoryType.id IN (:categoryTypeIds))
              AND (:isNewArrival IS NULL OR p.isNewArrival = :isNewArrival)
              AND p.isOutOfStock = false
              AND (:minPrice IS NULL OR p.price >= :minPrice)
              AND (:maxPrice IS NULL OR p.price <= :maxPrice)
              AND (:#{#sizes == NULL or #sizes.isEmpty()} = true OR  pv.size IN :sizes)
              AND (:#{#keywords == NULL} = true OR
                (LOWER(pt.name) LIKE CONCAT('%', :keywords, '%') OR LOWER(pt.description) LIKE CONCAT('%', :keywords, '%')))

    """)

    Page<Object[]> findByFilters(
            @Param("categoryId") UUID categoryId,
            @Param("categoryTypeIds") List<UUID> categoryTypeIds,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("sizes") List<String> sizes,
            @Param("keywords") String keywords,
            @Param("isNewArrival") Boolean isNewArrival,
            @Param("languageId") UUID languageId,
            Pageable pageable);
}


//AND (
//                    :keywords IS NULL
//        OR LOWER(pt.name) LIKE LOWER(CONCAT('%', :keywords, '%'))
//OR LOWER(pt.description) LIKE LOWER(CONCAT('%', :keywords, '%')))


//AND (:isNewArrival IS NULL OR p.isNewArrival = :isNewArrival)
//AND p.isOutOfStock = false
//AND (:minPrice IS NULL OR p.price >= :minPrice)
//AND (:maxPrice IS NULL OR p.price <= :maxPrice)
//AND (:sizes IS NULL OR SIZE(:sizes) = 0 OR pv.size IN :sizes)

