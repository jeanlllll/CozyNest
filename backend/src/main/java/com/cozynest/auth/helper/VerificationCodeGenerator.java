package com.cozynest.auth.helper;

import java.security.SecureRandom;

public class VerificationCodeGenerator {

    public static String generateVerificationCode() {
        SecureRandom secureRandom = new SecureRandom();
        int code = 100_000+ secureRandom.nextInt(900_000); //exclude 900_000
        return String.valueOf(code);
    }
}
