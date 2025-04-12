package com.cozynest.auth.helper;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.util.List;

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

    public void clearOauthStateInCookie(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie ck : cookies) {
                if ("oauth_state".equals(ck.getName())) {
                    Cookie removeCookie = new Cookie("oauth_state", null);
                    removeCookie.setMaxAge(0);
                    removeCookie.setPath("/");
                    removeCookie.setHttpOnly(true);
                    removeCookie.setSecure(true);
                    removeCookie.setAttribute("SameSite", "Strict");
                    response.addCookie(removeCookie);
                }
            }
        }
    }
}
