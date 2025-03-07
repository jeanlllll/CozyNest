package com.cozynest.entities.products;

import com.cozynest.auth.entities.Client;
import com.cozynest.entities.products.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="review")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private Float rating;

    @Column(nullable = false)
    private String comment;

    @ManyToOne
    @JoinColumn(name="products_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name="client_id")
    private Client client;

    @Column(nullable = false)
    private LocalDate createdOn;
}
