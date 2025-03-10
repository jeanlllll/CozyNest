package com.cozynest.repositories;

import com.cozynest.entities.profiles.cart.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {

    Cart findByClient_Id(UUID clientId);
}
