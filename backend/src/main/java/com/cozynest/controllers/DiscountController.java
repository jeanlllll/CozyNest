package com.cozynest.controllers;

import com.cozynest.dtos.DiscountCodeResponse;
import com.cozynest.services.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discountCode")
public class DiscountController {

    @Autowired
    DiscountService discountService;

    @GetMapping
    public ResponseEntity<DiscountCodeResponse> verifyDiscountCode(@RequestParam(value = "discountCode") String discountCode) {
        DiscountCodeResponse discountCodeResponse = discountService.verifyAndGetDiscountCodeDetail(discountCode);
        return ResponseEntity.ok(discountCodeResponse);
    }
}
