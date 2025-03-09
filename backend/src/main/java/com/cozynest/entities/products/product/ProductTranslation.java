package com.cozynest.entities.products.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="product_translation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductTranslation {

    @EmbeddedId
    private ProductTranslationId id;

    @Column(nullable = false, length=500)
    private String name;

    @Column(nullable = false, length=500)
    private String description;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

}
