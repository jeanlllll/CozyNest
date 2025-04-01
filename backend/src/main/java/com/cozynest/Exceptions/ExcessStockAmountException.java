package com.cozynest.Exceptions;

public class ExcessStockAmountException extends RuntimeException {
    public ExcessStockAmountException(String message) {
        super(message);
    }
}
