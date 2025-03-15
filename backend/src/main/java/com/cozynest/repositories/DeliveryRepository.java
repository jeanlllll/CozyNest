package com.cozynest.repositories;

import com.cozynest.entities.orders.order.Delivery;
import com.cozynest.entities.orders.order.DeliveryMethod;
import com.stripe.model.tax.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {

    Delivery findByDeliveryMethod(DeliveryMethod deliveryMethod);
}
