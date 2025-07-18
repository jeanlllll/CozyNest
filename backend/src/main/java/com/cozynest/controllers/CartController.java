package com.cozynest.controllers;

import com.cozynest.Helper.BindingResultHelper;
import com.cozynest.Helper.CheckAuthenticationHelper;
import com.cozynest.dtos.ApiResponse;
import com.cozynest.dtos.CartItemDto;
import com.cozynest.dtos.CartItemQuantityUpdateRequest;
import com.cozynest.dtos.CartRequest;
import com.cozynest.services.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    CheckAuthenticationHelper checkAuthenticationHelper;

    @Autowired
    CartService cartService;

    @Autowired
    BindingResultHelper bindingResultHelper;

    @GetMapping
    public List<CartItemDto> getCartItemList() {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        return cartService.getUserFavoriteItemList(userId);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody CartRequest cartRequest, BindingResult result) throws Exception {
        ResponseEntity errorResponse = bindingResultHelper.convertBindErrorToResponse(result);
        if (errorResponse != null) return errorResponse;
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
    public ResponseEntity<?> removeCartItem(@PathVariable UUID cartItemId) throws Exception {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        ApiResponse response = cartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.status(response.getStatus()).body(response.getMessage());
    }
}
