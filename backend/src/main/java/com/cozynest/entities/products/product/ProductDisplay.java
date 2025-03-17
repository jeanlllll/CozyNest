package com.cozynest.entities.products.product;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name="product_display")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDisplay {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Boolean isPrimary;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name="product_id", nullable = false)
    private Product product;
}
