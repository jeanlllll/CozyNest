package com.cozynest.entities.products.materials;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="material_translation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialTranslation {

    @EmbeddedId
    private MaterialTranslationId id;

    @Column(nullable = false)
    private String name;
}
