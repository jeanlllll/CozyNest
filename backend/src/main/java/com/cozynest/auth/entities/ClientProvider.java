package com.cozynest.auth.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="client_provider")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientProvider {

    @EmbeddedId
    private ClientProviderId id;

    @ManyToOne
    @JoinColumn(name="client_id", nullable = false)
    @MapsId("clientId")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Client client;
}
