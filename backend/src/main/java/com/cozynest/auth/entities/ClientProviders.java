package com.cozynest.auth.entities;

import jakarta.persistence.*;
import lombok.*;

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
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Client client;
}
