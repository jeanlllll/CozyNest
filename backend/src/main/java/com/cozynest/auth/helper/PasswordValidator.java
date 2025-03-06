package com.cozynest.auth.helper;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class PasswordValidator {


    //ensure password length at least 8,
    // at least one Upper case letter, one lower case letter, one number one special char in password

    public boolean isValidPassword(String password) {
        if (password.length() < 8) return false;
        boolean hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
        String specialChars = "@#$%^&+=!,.";

        for (char c: password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (specialChars.contains(String.valueOf(c))) hasSpecial = true;
        }

        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}
