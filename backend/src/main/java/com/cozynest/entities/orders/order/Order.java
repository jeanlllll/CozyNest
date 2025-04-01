package com.cozynest.entities.orders.order;

import com.cozynest.auth.entities.Client;
import com.cozynest.entities.orders.discount.Discount;
import com.cozynest.entities.orders.payment.Payment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="shop_order")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus orderStatus;

    private String shipmentTrackingNumber;

    private LocalDateTime deliveryDate;

    @ManyToOne
    @JoinColumn(name="client_id")
    private Client client;

    private String address;

    @ManyToOne
    @JoinColumn(name="discount_id")
    private Discount discount;

    private Float promotionDiscountAmount;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @OneToOne(mappedBy = "order")
    private Payment payment;

    @ManyToOne
    @JoinColumn(name="delivery_id")
    private Delivery delivery;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private Float originalAmount;

    @Column(nullable = false)
    private float discountAmount;

    @Column(nullable = false)
    private Float totalAmount;

    @Column(nullable = false)
    private Float transportationAmount;

}
