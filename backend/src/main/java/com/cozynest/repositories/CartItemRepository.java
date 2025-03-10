package com.cozynest.repositories;
;
import com.cozynest.entities.profiles.cart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
}
