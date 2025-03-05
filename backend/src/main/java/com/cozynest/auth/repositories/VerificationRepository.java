package com.cozynest.auth.repositories;


import com.cozynest.auth.entities.Client;
import com.cozynest.auth.entities.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VerificationRepository extends JpaRepository<Verification, UUID> {
}
