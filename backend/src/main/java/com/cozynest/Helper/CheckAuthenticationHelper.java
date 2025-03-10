package com.cozynest.Helper;

import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.repositories.ShopUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CheckAuthenticationHelper {

    @Autowired
    ShopUserRepository shopUserRepository;

    public UUID getUserIdViaAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ShopUser shopUser = shopUserRepository.findByEmail(email);
        if (shopUser == null) {
            throw new IllegalStateException("User not found");
        }
        return shopUser.getId();
    }
}
