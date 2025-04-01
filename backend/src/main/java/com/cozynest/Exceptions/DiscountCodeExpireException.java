package com.cozynest.Exceptions;

public class DiscountCodeExpireException extends RuntimeException {
    public DiscountCodeExpireException(String message) {
        super(message);
    }
}
