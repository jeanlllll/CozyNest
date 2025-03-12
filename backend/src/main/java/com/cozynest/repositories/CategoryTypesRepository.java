package com.cozynest.repositories;

import com.cozynest.entities.products.categoryType.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryTypesRepository extends JpaRepository<CategoryType, UUID> {

    CategoryType findByCodeAndCategory_id(String code, UUID categoryId);

}
