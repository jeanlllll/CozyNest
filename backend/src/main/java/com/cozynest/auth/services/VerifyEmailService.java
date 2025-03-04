package com.cozynest.auth.services;

import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.entities.ShopUserUserType;
import com.cozynest.auth.helper.JwtUtil;
import com.cozynest.auth.repositories.ShopUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VerifyEmailService {

    @Autowired
    private ShopUserRepository shopUserRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public boolean VerifyEmail(String email, String code) {
        ShopUser user = shopUserRepository.findByEmail(email);
        if (user.getVerificationCode().equals(code)) {
            user.setIsVerified(true);
            ShopUserUserType userRoles = user.getUserType();
            return true;
        }
        return false;
    }
}
