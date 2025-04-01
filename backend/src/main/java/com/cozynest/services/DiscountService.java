package com.cozynest.services;

import com.cozynest.Exceptions.DiscountCodeExpireException;
import com.cozynest.dtos.DiscountCodeResponse;
import com.cozynest.entities.orders.discount.Discount;
import com.cozynest.repositories.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.NoSuchElementException;

@Service
public class DiscountService {

    @Autowired
    DiscountRepository discountRepository;

    public DiscountCodeResponse verifyAndGetDiscountCodeDetail(String discountCode) {
        // 1. check whether discount code exist
        Discount discount = discountRepository.findByDiscountCode(discountCode);
        if (discount == null) {
            throw new NoSuchElementException("Discount code not found.");
        }

        //2. whether discount code is expire
        boolean isExpire = discount.getExpireDate().isBefore(LocalDate.now());
        if (isExpire) {
            throw new DiscountCodeExpireException("Discount code expire");
        }

        // 3. ok and set response
        DiscountCodeResponse discountCodeResponse = DiscountCodeResponse.builder()
                .discountCode(discountCode)
                .discountType(String.valueOf(discount.getDiscountType()))
                .discountValue(discount.getDiscountValue())
                .minPurchaseAmount(discount.getMinPurchaseAmount())
                .build();
        return discountCodeResponse;
    }
}
