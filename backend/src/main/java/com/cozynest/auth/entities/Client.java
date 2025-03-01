package com.cozynest.auth.entities;

import com.cozynest.entities.orders.order.Order;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="client")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    private UUID id;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClientProvider provider;

    private UUID stripeId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="shop_user_id")
    @MapsId
    private ShopUser user;

    @OneToMany(mappedBy = "client")
    private List<Order> orders;
}
