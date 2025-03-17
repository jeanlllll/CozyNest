package com.cozynest.entities.products.product;

import com.cozynest.entities.products.materials.Material;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name="product_material")
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

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name="material_id")
    private Material material;
}
