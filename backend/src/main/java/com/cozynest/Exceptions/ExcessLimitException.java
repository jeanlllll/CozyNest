package com.cozynest.Exceptions;

public class ExcessLimitException extends RuntimeException{
    public ExcessLimitException(String message) {
        super(message);
    }
}
