package com.cozynest.Exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice //@ControllerAdvice + @ResponseBody
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ProductNotFoundException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    @ExceptionHandler(ProductAlreadyInCartException.class)
    public ResponseEntity<?> handleAlreadyInCart(ProductAlreadyInCartException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(ExcessLimitException.class)
    public ResponseEntity<?> handleExcessLimit(ExcessLimitException ex) {
        return ResponseEntity.status(403).body(ex.getMessage());
    }

    @ExceptionHandler(ExcessStockAmountException.class)
    public ResponseEntity<?> handleExcessStock(ExcessStockAmountException ex) {
        return ResponseEntity.status(400).body(ex.getMessage());
    }

    @ExceptionHandler(CartItemNotFoundException.class)
    public ResponseEntity<?>  handleCartItemNotFound(Exception ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    @ExceptionHandler(DiscountCodeExpireException.class)
    public ResponseEntity<?>  handleDiscountCodeExpire(Exception ex) {
        return ResponseEntity.status(410).body(ex.getMessage()); //410 - gone http status
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?>  handleOther(Exception ex) {
        return ResponseEntity.status(500).body("Internal Server Error:" + ex.getMessage());
    }

}
