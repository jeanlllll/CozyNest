package com.cozynest.auth.helper;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class CookieGenerateHelper {

    public void generateCookieToResponse(String cookieName, String value, int expiration, boolean httpOnly, HttpServletResponse response) {
        Cookie cookie = new Cookie(cookieName, value);
        cookie.setHttpOnly(httpOnly);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(expiration); //cookie age in second, not millisecond
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

}
