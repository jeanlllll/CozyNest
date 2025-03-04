package com.cozynest.auth.helper;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Set;

import com.cozynest.auth.exceptions.JwtException;

@Component
public class JwtUtil {

    @Value("${jwt.secret_key}")
    private String secret_key;

    @Value("${jwt.access_token.expiration_time}")
    private long access_token_expiration;

    @Value("${jwt.refresh_token.expiration_time}")
    private long refresh_token_expiration;

    private SecretKey key;

    @PostConstruct
    private void generateKey() {
        key = Keys.hmacShaKeyFor(secret_key.getBytes());
    }

    public String generateAccessToken(String username, Set<String> rolesList) {
        return generateTokenHelper(username, rolesList, access_token_expiration);
    }

    public String generateRefreshToken(String username, Set<String> rolesList) {
        return generateTokenHelper(username, rolesList, refresh_token_expiration);
    }

    public String generateTokenHelper(String username, Set<String> rolesList, long expirationTime) {
        return Jwts.builder()
                .issuer("CozyNest")
                .subject(username)
                .issuedAt(new Date())
                .claim("roles", rolesList)
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private Jws<Claims> getJwtClaims(String token) {
        try {
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

    public Boolean isValidateToken(String token) {
        try {
            getJwtClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUserName(String token) {
        Jws<Claims> claimsJws = getJwtClaims(token);
        return claimsJws.getPayload().getSubject();
    }

    public Set<String> getUserRoleSet(String token) {
        Jws<Claims> claimsJws = getJwtClaims(token);
        return (Set<String>) claimsJws.getPayload().get("roles", Set.class);
    }

    public Date getExpirationDate(String token) {
        Jws<Claims> claimsJws = getJwtClaims(token);
        return claimsJws.getPayload().getExpiration();
    }
}
