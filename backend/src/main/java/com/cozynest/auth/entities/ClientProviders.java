package com.cozynest.auth.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="client_providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientProviders {

    @EmbeddedId
    private ClientProvidersId id;

    @ManyToOne
    @JoinColumn(name="client_id", nullable = false)
    @MapsId("clientId")
    private Client client;
}
