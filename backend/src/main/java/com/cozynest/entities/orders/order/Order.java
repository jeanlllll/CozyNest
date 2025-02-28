package com.cozynest.entities.orders.order;

import com.cozynest.auth.entities.Client;
import com.cozynest.entities.orders.discount.Discount;
import com.cozynest.entities.orders.payment.Payment;
import com.cozynest.entities.orders.payment.PaymentMethod;
import com.cozynest.entities.profiles.Address;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="orders")
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

    @Column(nullable = false)
    private Float totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    private String shipmentTrackingNumber;

    private LocalDateTime expectedDeliveryDate;

    private float discountAmount = 0;

    @ManyToOne
    @JoinColumn(name="client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name="address_id")
    private Address address;

    @ManyToOne
    @JoinColumn(name="discount_id")
    private Discount discount;

    @OneToMany(mappedBy = "order")
    private List<OrderItem> orderItems;

    @OneToOne
    @JoinColumn(name="payment_id")
    private Payment payment;

    @OneToOne
    @JoinColumn(name="delivery_id")
    private Delivery delivery;

}
