package com.cozynest.repositories;

import com.cozynest.entities.products.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Category findByCode(String code);

    @Query("""
        SELECT DISTINCT c.id
        FROM Category c
    """)
    List<UUID> findAllCategoryId();
}
