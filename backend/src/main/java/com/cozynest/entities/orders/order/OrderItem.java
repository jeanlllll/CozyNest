package com.cozynest.entities.orders.order;

import com.cozynest.entities.products.product.Product;
import com.cozynest.entities.products.product.ProductVariant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="order_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Float itemPrice;

    @ManyToOne
    @JoinColumn(name="products_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name="product_variant_id")
    private ProductVariant productVariant;

    @ManyToOne
    @JoinColumn(name="orders_id")
    private Order order;
}
