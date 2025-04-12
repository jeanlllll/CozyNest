package com.cozynest.auth.services;

import com.cozynest.auth.config.CorsConfig;
import com.cozynest.auth.config.JwtAuthenticationFilter;
import com.cozynest.auth.helper.CookieGenerateHelper;
import com.cozynest.auth.helper.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Value("${jwt.access_token.expiration_time}")
    private int access_token_expiration;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieGenerateHelper cookieGenerateHelper;

    public boolean isTokenValid(String token, String tokenType) { //token not null, not expired, and verify success
        return token != null && jwtUtil.isValidateToken(token, tokenType);
    }

    public void setAuthentication(String token, String keyType) {
        String userName = jwtUtil.getUserName(token, keyType);
        List<String> userRoles = jwtUtil.getUserRoleList(token, keyType);

        List<SimpleGrantedAuthority> authorities = userRoles.stream()
                .map(role -> new SimpleGrantedAuthority(role))
                .collect(Collectors.toList());

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userName, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    public void addAccessTokenToResponse(HttpServletResponse response, String userName, List<String> roleList) {
        String accessToken = jwtUtil.generateAccessToken(userName, roleList);
        cookieGenerateHelper.generateCookieToResponse("access_token", accessToken, access_token_expiration/1000, true, response);
    }

    public Map<String, String> getAccessTokenNRefreshToken(HttpServletRequest request) {
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
        Map<String, String> tokenMap = new HashMap<>();
        if (accessToken != null) {
            tokenMap.put("accessToken", accessToken);
        }
        if (refreshToken != null) {
            tokenMap.put("refreshToken", refreshToken);
        }
        return tokenMap;
    }
    public Boolean checkIsLoginOrNot(HttpServletRequest request, HttpServletResponse response) {
        Map<String, String> tokenMap = getAccessTokenNRefreshToken(request);

        String accessToken = tokenMap.get("accessToken");
        String refreshToken = tokenMap.get("refreshToken");

        if (accessToken == null && refreshToken == null) return false;

        if (isTokenValid(accessToken, "accessKey")) {
            return true;
        }

        // Access expired, refresh still valid
        if (!isTokenValid(accessToken, "accessKey") && isTokenValid(refreshToken, "refreshKey")) {
            setAuthentication(refreshToken, "refreshKey");
            String userName = jwtUtil.getUserName(refreshToken, "refreshKey");
            List<String> roleList = jwtUtil.getUserRoleList(refreshToken, "refreshKey");
            addAccessTokenToResponse(response, userName, roleList);
            return true;
        }
        return false;
    }
}
