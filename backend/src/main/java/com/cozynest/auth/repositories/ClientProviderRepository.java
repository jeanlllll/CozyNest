package com.cozynest.auth.repositories;

import com.cozynest.auth.entities.ClientProvider;
import com.cozynest.auth.entities.ClientProviderId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientProviderRepository extends JpaRepository<ClientProvider, ClientProviderId> {
}
