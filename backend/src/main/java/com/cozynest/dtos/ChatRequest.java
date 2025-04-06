package com.cozynest.dtos;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ChatRequest {

    String sessionId;
    String message;
}
