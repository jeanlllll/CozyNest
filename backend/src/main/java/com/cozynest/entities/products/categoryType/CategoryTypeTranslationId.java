package com.cozynest.entities.products.categoryType;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryTypeTranslationId implements Serializable {

    private UUID categoryTypeId;

    private UUID languageId;
}
