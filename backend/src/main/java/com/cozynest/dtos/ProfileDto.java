package com.cozynest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {

    @NotBlank(message = "First name cannot be blank.")
    String firstName;

    @NotBlank(message = "Last name cannot be blank.")
    String lastName;

    @NotBlank(message = "Phone number cannot be blank.")
    String phoneNumber;

    @NotEmpty(message = "Address List cannot be blank.")
    @Size(min = 1, max = 5, message = "Address list must contain between 1 and 5 addresses.")
    List<AddressDto> addressList;
}
