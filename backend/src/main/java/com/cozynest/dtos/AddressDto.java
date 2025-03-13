package com.cozynest.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class AddressDto {

    UUID addressId;

    @NotBlank(message = "Floor and building cannot be blank.")
    String floorNBuilding;

    @NotBlank(message = "Street cannot be blank.")
    String street;

    @NotBlank(message = "City cannot be blank.")
    String city;

    @NotBlank(message = "State cannot be blank.")
    String state;

    @NotBlank(message = "Country cannot be blank.")
    String country;

    @NotBlank(message = "PostalCode cannot be blank.")
    String postalCode;

}
