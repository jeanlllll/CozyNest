package com.cozynest.entities.products.product;

import com.cozynest.entities.products.Category;
import com.cozynest.entities.products.categoryType.CategoryType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private Float price;

    @Column(nullable = false)
    private Boolean isNewArrival;

    @Column(nullable = false, columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime createdOn;

    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime updatedOn;

    private Float avgRating = 0.0f;

    private int reviewCount = 0;

    @ManyToOne
    @JoinColumn(name="category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name="category_type_id", nullable = false)
    private CategoryType categoryType;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch=FetchType.LAZY)
    @JsonIgnore
    private List<ProductVariant> productVariants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch=FetchType.LAZY)
    @JsonIgnore
    private List<ProductDisplay> productDisplays;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch=FetchType.LAZY)
    @JsonIgnore
    private List<ProductMaterial> productMaterials;


}
