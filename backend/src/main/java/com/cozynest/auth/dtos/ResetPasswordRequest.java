package com.cozynest.auth.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "Email cannot be blank.")
    String email;

    @NotBlank(message = "Verification code cannot be blank.")
    String verificationCode;

    @NotBlank(message = "New password cannot be blank.")
    String newPassword;

    @NotBlank(message = "Confirm password cannot be blank.")
    String confirmPassword;
}
