package com.cozynest.auth.entities;

import com.cozynest.entities.orders.order.Order;
import com.cozynest.entities.profiles.cart.Cart;
import com.cozynest.entities.profiles.favorites.Favorite;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
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

    private UUID stripeId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="shop_user_id")
    @MapsId
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private ShopUser shopUser;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<ClientProviders> clientProviders;

    @OneToOne(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private Favorite favorite;

    @OneToOne(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;
}
