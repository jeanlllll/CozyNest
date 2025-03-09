package com.cozynest.entities.profiles.favorites;

import com.cozynest.entities.products.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="favorite_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name="favorite_id")
    private Favorite favorite;

    @Column(nullable = false, columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime addDateTime;
}
