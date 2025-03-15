package com.cozynest.controllers;

import com.cozynest.Helper.BindingResultHelper;
import com.cozynest.Helper.CheckAuthenticationHelper;
import com.cozynest.dtos.OrderRequest;
import com.cozynest.services.OrderService;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    CheckAuthenticationHelper checkAuthenticationHelper;

    @Autowired
    OrderService orderService;

    @Autowired
    BindingResultHelper bindingResultHelper;

    @PostMapping
    public ResponseEntity<?> postOrder(@Valid @RequestBody OrderRequest  orderRequest, BindingResult result) throws StripeException {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        bindingResultHelper.convertBindErrorToResponse(result);
        Map<String, String> paymentMap = orderService.createCheckOutSession(orderRequest, userId);
        return ResponseEntity.ok(paymentMap);
    }



}
