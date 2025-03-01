package com.cozynest.auth.repositories;

import com.cozynest.auth.entities.ShopUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ShopUserRepository extends JpaRepository<ShopUser, UUID> {

    //big O - logN
    ShopUser findByEmail(String email);
}
