package com.cozynest.auth.config;

import com.cozynest.auth.helper.CookieGenerateHelper;
import com.cozynest.auth.helper.JwtUtil;
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
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.access_token.expiration_time}")
    private int access_token_expiration;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieGenerateHelper cookieGenerateHelper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. get access token and refresh token in cookies
        Cookie[] cookies = request.getCookies();

        String accessToken = null;
        String refreshToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("access_token")) {
                    accessToken = cookie.getValue();
                } else if (cookie.getName().equals("refresh_token")) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        // 2. if access Token and refresh token are null, pass it to next filter
        if (accessToken == null && refreshToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. if access Token is valid
        if (isTokenValid(accessToken, "accessKey")) {
            setAuthentication(accessToken, "accessKey");
            filterChain.doFilter(request, response);
            return;
        }

        // 4. if access token is invalid, refresh token is valid
        if (!isTokenValid(accessToken, "accessKey") && isTokenValid(refreshToken, "refreshKey")) {
            setAuthentication(refreshToken, "refreshKey");
            String userName = jwtUtil.getUserName(refreshToken, "refreshKey");
            List<String> roleList = jwtUtil.getUserRoleList(refreshToken, "refreshKey");
            addAccessTokenToResponse(response, userName, roleList);
            filterChain.doFilter(request, response);
            return;

        }

        // 5. neither token is valid, force re-login
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Jwt Authentication failed.\"}");

    }

    private boolean isTokenValid(String token, String tokenType) { //token not null, not expired, and verify success
        return token != null && jwtUtil.isValidateToken(token, tokenType);
    }

    private void setAuthentication(String token, String keyType) {
        String userName = jwtUtil.getUserName(token, keyType);
        List<String> userRoles = jwtUtil.getUserRoleList(token, keyType);

        List<SimpleGrantedAuthority> authorities = userRoles.stream()
                .map(role -> new SimpleGrantedAuthority(role))
                .collect(Collectors.toList());

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userName, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private void addAccessTokenToResponse(HttpServletResponse response, String userName, List<String> roleList) {
        String accessToken = jwtUtil.generateAccessToken(userName, roleList);
        cookieGenerateHelper.generateCookieToResponse("access_token", accessToken, access_token_expiration/1000, true, response);
    }
}
