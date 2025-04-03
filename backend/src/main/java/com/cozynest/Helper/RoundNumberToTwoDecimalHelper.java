package com.cozynest.Helper;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class RoundNumberToTwoDecimalHelper {

    public float roundNumberToTwoDecimalFloatNumber(float number) {
        BigDecimal roundedAmount = new BigDecimal(number).setScale(2, RoundingMode.HALF_UP);
        return roundedAmount.floatValue();
    }
}
