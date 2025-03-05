package com.cozynest.auth.repositories;


import com.cozynest.auth.entities.AuthAuthority;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.entities.ShopUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuthAuthorityRepository extends JpaRepository<AuthAuthority, UUID>{

    AuthAuthority findByRoleCode(String code);
}
