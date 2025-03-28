package com.cozynest.auth.dtos;

import lombok.Data;

@Data
public class GoogleOAuthCallbackRequest {
    String code;
    String state;
}
