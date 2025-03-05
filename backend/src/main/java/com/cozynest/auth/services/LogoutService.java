package com.cozynest.auth.services;

import com.cozynest.auth.helper.CookieGenerateHelper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class LogoutService {

    @Autowired
    CookieGenerateHelper cookieGenerateHelper;

    public void logout(HttpServletResponse response) {
        cookieGenerateHelper.generateCookieToResponse("access_token", "", 0, true, response);
        cookieGenerateHelper.generateCookieToResponse("refresh_token", "", 0, true, response);
        SecurityContextHolder.clearContext();
    }
}
