package com.cozynest.entities.products.categoryType;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="category_type_translation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryTypeTranslation {

    @EmbeddedId
    private CategoryTypeTranslationId id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;
}
