package com.cozynest.entities.profiles;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.cozynest.auth.entities.Client;

import java.util.UUID;

@Entity
@Table(name="address")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "Floor and building cannot be blank")
    @Column(nullable = false, length = 50)
    private String floorNBuilding;

    @NotBlank(message = "Street cannot be blank")
    @Column(nullable = false, length = 50)
    private String street;

    @NotBlank(message = "City cannot be blank")
    @Column(nullable = false, length = 50)
    private String city;

    @NotBlank(message = "State cannot be blank")
    @Column(nullable = false, length = 50)
    private String state;

    @NotBlank(message = "Country cannot be blank")
    @Column(nullable = false, length = 50)
    private String country;

    @NotBlank(message = "ZipCode cannot be blank")
    @Column(nullable = false, length = 10)
    private String postalCode;

    @ManyToOne
    @JoinColumn(name="client_id")
    private Client client;
}
