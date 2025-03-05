package com.cozynest.auth.helper;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Set;

import com.cozynest.auth.exceptions.JwtException;

@Component
public class JwtUtil {

    @Value("${jwt.access_token.secret_key}")
    private String accessToken_Secret_key;

    @Value("${jwt.refresh_token.secret_key}")
    private String refreshToken_secret_key;

    @Value("${jwt.access_token.expiration_time}")
    private long access_token_expiration;

    @Value("${jwt.refresh_token.expiration_time}")
    private long refresh_token_expiration;

    private SecretKey accessKey;
    private SecretKey refreshKey;

    @PostConstruct
    private void generateKey() {
        accessKey = Keys.hmacShaKeyFor(accessToken_Secret_key.getBytes());
        refreshKey = Keys.hmacShaKeyFor(refreshToken_secret_key.getBytes());
    }

    public String generateAccessToken(String username, List<String> rolesList) {
        return generateTokenHelper(username, rolesList, access_token_expiration, accessKey);
    }

    public String generateRefreshToken(String username, List<String> rolesList) {
        return generateTokenHelper(username, rolesList, refresh_token_expiration, refreshKey);
    }

    public String generateTokenHelper(String username, List<String> rolesList, long expirationTime, SecretKey key) {
        return Jwts.builder()
                .issuer("CozyNest")
                .subject(username)
                .issuedAt(new Date())
                .claim("roles", rolesList)
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private Jws<Claims> getJwtClaims(String token, String keyType) {
        try {
            SecretKey key;
            if (keyType.equals("accessKey")) {
                key = accessKey;
            } else if (keyType.equals("refreshKey")) {
                key = refreshKey;
            } else {
                throw new JwtException();
            }
            return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
        } catch (Exception e) {
            throw new JwtException();
        }
    }
    /* --------------------------------
    getJwtClaims() return object like this
    {
        Header: {alg=HS256, typ=JWT},
        Body: {sub=user123, iat=1699999999, exp=1700009999, iss=CozyNest},
        Signature: XYZ123abc...
    }
    ----------------------------------  */

    public Boolean isValidateToken(String token, String keyType) {
        try {
            Jws<Claims> claims = getJwtClaims(token, keyType);
            return claims.getPayload().getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String getUserName(String token, String keyType) {
        Jws<Claims> claimsJws = getJwtClaims(token, keyType);
        return claimsJws.getPayload().getSubject();
    }

    public List<String> getUserRoleList(String token, String keyType) {
        Jws<Claims> claimsJws = getJwtClaims(token, keyType);
        return claimsJws.getPayload().get("roles", List.class);
    }

    public Date getExpirationDate(String token, String keyType) {
        Jws<Claims> claimsJws = getJwtClaims(token, keyType);
        return claimsJws.getPayload().getExpiration();
    }

}
