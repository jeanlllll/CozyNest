package com.cozynest.repositories;

import com.cozynest.entities.orders.discount.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, UUID> {

    // log N
    Discount findByDiscountCode(String code);
}
