package com.cozynest.entities.orders.order;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="delivery")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String deliveryMethod;

    @Column(nullable = false)
    private Integer transportationFee;

    @Column(nullable = false)
    private Integer minDeliveryDays;

    @Column(nullable = false)
    private Integer maxDeliveryDays;

}
