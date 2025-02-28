package com.cozynest.entities.products.materials;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialTranslationId implements Serializable {

    private UUID materialId;

    private UUID languageId;
}
