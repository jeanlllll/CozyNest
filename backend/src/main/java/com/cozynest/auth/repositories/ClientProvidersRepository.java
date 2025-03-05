package com.cozynest.auth.repositories;

import com.cozynest.auth.entities.ClientProviders;
import com.cozynest.auth.entities.ClientProvidersId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientProvidersRepository extends JpaRepository<ClientProviders, ClientProvidersId> {
}
