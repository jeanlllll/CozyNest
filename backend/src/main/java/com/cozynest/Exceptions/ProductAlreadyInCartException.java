package com.cozynest.Exceptions;

import com.cozynest.entities.products.product.ProductVariant;

public class ProductAlreadyInCartException extends RuntimeException{
    public ProductAlreadyInCartException(String message) {
        super(message);
    }
}
