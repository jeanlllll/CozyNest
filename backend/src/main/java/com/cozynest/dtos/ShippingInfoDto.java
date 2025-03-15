package com.cozynest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShippingInfoDto {

    @NotBlank
    String receiver;

    @NotBlank
    String phoneNumber;

    @NotNull
    AddressDto address;

}
