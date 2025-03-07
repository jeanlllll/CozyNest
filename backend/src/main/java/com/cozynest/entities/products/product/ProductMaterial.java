package com.cozynest.entities.products.product;

import com.cozynest.entities.products.materials.Material;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="product_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private Integer percentage;

    @ManyToOne
    @JoinColumn(name="products_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name="material_id")
    private Material material;
}
