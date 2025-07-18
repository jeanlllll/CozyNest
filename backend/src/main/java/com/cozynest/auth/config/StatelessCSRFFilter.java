package com.cozynest.auth.config;

import com.cozynest.auth.helper.CookieGenerateHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;

@Component
public class StatelessCSRFFilter extends OncePerRequestFilter {

    @Autowired
    private CookieGenerateHelper cookieGenerateHelper;

    private static final Logger logger = LoggerFactory.getLogger(StatelessCSRFFilter.class);

    /* custom csrf filter, not use java default csrf cookie token function. bcz in this custom one, for csrf token already in cookie, it does not
       re-generate a new csrf token. but in java default csrf cookie function, it will generate a new csrf token for every request */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getRequestURI().endsWith("/webhook")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 1. extract csrf token in header and in cookie
        final String csrfTokenInHeader = request.getHeader("X-CSRF-TOKEN");
        final Cookie[] cookies = request.getCookies();

        String csrfTokenInCookie = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("CSRF_TOKEN")) {
                    csrfTokenInCookie = cookie.getValue();
                    break;
                }
            }
        }

        // 2. if csrf token in cookie is null, generate a csrf token to cookie
        if (csrfTokenInCookie == null || csrfTokenInCookie.trim().isEmpty()) {
            csrfTokenInCookie = generateCSRFToken();
            cookieGenerateHelper.generateCookieToResponse("CSRF_TOKEN", csrfTokenInCookie, -1, false, response);
        }

        /* 3. if the request method is put, post, delete, path, or connect,
              it needs to check whether its csrf token in header and csrf token in cookie are the same */
        final Set<String> protectedMethods = new HashSet<>() ;
        protectedMethods.addAll(Set.of("PUT", "DELETE", "POST", "PATCH", "CONNECT"));
        String requestMethod = request.getMethod();
        if (protectedMethods.contains(requestMethod)) {
            if (csrfTokenInHeader == null || !csrfTokenInHeader.equals(csrfTokenInCookie)) {
                logger.info(csrfTokenInHeader);
                logger.info(csrfTokenInCookie);
                logger.info(String.valueOf((boolean) csrfTokenInHeader.equals(csrfTokenInCookie)));
                logger.warn("CSRF token mismatch detected! IP: {}, User-Agent: {}, Path: {}",
                        request.getRemoteAddr(), request.getHeader("User-Agent"), request.getRequestURI());

                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Missing or non-matching CSRF token\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    public String generateCSRFToken() {
        SecureRandom random = new SecureRandom();
        byte[] tokenBytes = new byte[32];
        random.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }
}
