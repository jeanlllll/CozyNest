package com.cozynest.auth.entities;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientProvidersId implements Serializable {

    private UUID clientId;

    @Enumerated(EnumType.STRING)
    private ClientProvider clientProvider;
}
