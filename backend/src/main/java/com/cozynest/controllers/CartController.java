package com.cozynest.controllers;

import com.cozynest.Helper.CheckAuthenticationHelper;
import com.cozynest.dtos.ApiResponse;
import com.cozynest.dtos.CartItemDto;
import com.cozynest.dtos.CartItemQuantityUpdateRequest;
import com.cozynest.dtos.CartRequest;
import com.cozynest.services.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLOutput;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    CheckAuthenticationHelper checkAuthenticationHelper;

    @Autowired
    CartService cartService;

    @GetMapping
    public List<CartItemDto> getCartItemList() {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        System.out.println();
        return cartService.getUserFavoriteItemList(userId);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody CartRequest cartRequest, BindingResult result) throws ChangeSetPersister.NotFoundException {
        if (result.hasErrors()) {
            List<String> errors = result.getAllErrors()
                    .stream()
                    .map(error -> error.getDefaultMessage())
                    .toList();
            return ResponseEntity.badRequest().body(Set.of("errors"));
        }
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        ApiResponse response = cartService.addToCart(userId, cartRequest);
        return ResponseEntity.status(response.getStatus()).body(response.getMessage());
    }

    @PatchMapping("/update-quantity/{cartItemId}")
    public ResponseEntity<?> updateCartItemQuantity(@PathVariable UUID cartItemId,
                                                    @RequestBody CartItemQuantityUpdateRequest cartItemQuantityUpdateRequest,
                                                    BindingResult result) {
        if (result.hasErrors()) {
            List<String> errors = result.getAllErrors()
                    .stream()
                    .map(error -> error.getDefaultMessage())
                    .toList();
            return ResponseEntity.badRequest().body(Set.of("errors"));
        }

        int newQuantity = cartItemQuantityUpdateRequest.getQuantity();
        if (newQuantity <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Quantity must be greater than zero."));
        }
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        ApiResponse response = cartService.updateCartItemQuantity(userId, cartItemId, newQuantity);
        return ResponseEntity.status(response.getStatus()).body(response.getMessage());
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable UUID cartItemId) {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        ApiResponse response = cartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.status(response.getStatus()).body(response.getMessage());
    }
}
