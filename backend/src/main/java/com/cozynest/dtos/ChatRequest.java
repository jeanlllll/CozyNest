package com.cozynest.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
public class ChatRequest {

    @NotBlank(message = "Session cannot be blank.")
    String sessionId;

    @NotBlank(message = "Message cannot be blank.")
    String message;
}
