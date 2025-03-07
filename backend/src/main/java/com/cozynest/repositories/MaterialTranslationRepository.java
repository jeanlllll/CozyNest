package com.cozynest.repositories;

import com.cozynest.entities.products.materials.MaterialTranslation;
import com.cozynest.entities.products.materials.MaterialTranslationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialTranslationRepository extends JpaRepository<MaterialTranslation, MaterialTranslationId> {
}
