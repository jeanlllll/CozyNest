package com.cozynest.auth.controllers;

import com.cozynest.auth.config.StatelessCSRFFilter;
import com.cozynest.auth.helper.CookieGenerateHelper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/csrf")
public class CsrfController {

    @Autowired
    CookieGenerateHelper cookieGenerateHelper;

    @Autowired
    StatelessCSRFFilter statelessCSRFFilter;

    @GetMapping("/token")
    public ResponseEntity<String> getCsrfToken(HttpServletRequest request, HttpServletResponse response) {
        String csrfTokenInCookie = statelessCSRFFilter.generateCSRFToken();
        cookieGenerateHelper.generateCookieToResponse("CSRF_TOKEN", csrfTokenInCookie, -1, false, response);
        return ResponseEntity.ok(csrfTokenInCookie);
    }
}
