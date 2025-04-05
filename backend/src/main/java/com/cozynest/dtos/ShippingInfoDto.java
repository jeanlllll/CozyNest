package com.cozynest.dtos;

import com.cozynest.auth.entities.Client;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingInfoDto {

    @NotBlank
    String receiver;

    @NotBlank
    String phoneNumber;

    AddressDto addressDto;

}
