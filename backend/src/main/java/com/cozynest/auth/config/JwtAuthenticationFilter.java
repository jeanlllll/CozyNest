package com.cozynest.auth.config;

import com.cozynest.auth.helper.CookieGenerateHelper;
import com.cozynest.auth.helper.JwtUtil;
import com.cozynest.auth.services.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. get access token and refresh token in cookies
        Map<String, String> tokenMap = authService.getAccessTokenNRefreshToken(request);

        // 2. if access Token and refresh token are null, pass it to next filter
        String accessToken = tokenMap.get("accessToken");
        String refreshToken = tokenMap.get("refreshToken");

        if (accessToken == null && refreshToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. if access Token is valid
        if (authService.isTokenValid(accessToken, "accessKey")) {
            authService.setAuthentication(accessToken, "accessKey");
            filterChain.doFilter(request, response);
            return;
        }

        // 4. if access token is invalid, refresh token is valid
        if (!authService.isTokenValid(accessToken, "accessKey") && authService.isTokenValid(refreshToken, "refreshKey")) {
            authService.setAuthentication(refreshToken, "refreshKey");
            String userName = jwtUtil.getUserName(refreshToken, "refreshKey");
            List<String> roleList = jwtUtil.getUserRoleList(refreshToken, "refreshKey");
            authService.addAccessTokenToResponse(response, userName, roleList);
            filterChain.doFilter(request, response);
            return;
        }

        // 5. neither token is valid, force re-login
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Jwt Authentication failed.\"}");

    }


}
