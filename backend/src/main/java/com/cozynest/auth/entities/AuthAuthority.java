package com.cozynest.auth.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="auth_authority")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthAuthority {

    @Id
    private UUID id;

    private String roleCode;

    private String roleDescription;
}
