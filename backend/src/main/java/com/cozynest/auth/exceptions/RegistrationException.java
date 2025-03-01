package com.cozynest.auth.exceptions;

import com.cozynest.auth.services.RegistrationService;

public class RegistrationException extends  RuntimeException{

    public RegistrationException(String message) {
        super(message);
    }

    public RegistrationException(String message, Throwable cause) {
        super(message, cause);
    }

}
