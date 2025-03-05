package com.cozynest.auth.services;

import com.cozynest.auth.dtos.Oauth2CallbackResponse;
import com.cozynest.auth.helper.CookieGenerateHelper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

//https://developers.google.com/identity/protocols/oauth2/web-server#httprest_3, reference to google server-side web app website

@Service
public class Oauth2Service {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String client_id;

    @Value("${spring.security.oauth2.client.provider.google.authorization-uri}")
    private String authorization_url;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirect_url;

    @Value("#{'${spring.security.oauth2.client.registration.google.scope}'.split(',')}")
    private List<String> scope;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String client_secret;

    @Value("${spring.security.oauth2.client.provider.google.token-uri}")
    private String token_url;

    @Value("${spring.security.oauth2.client.provider.google.user-info-uri}")
    private String user_info_url;



    @Autowired
    CookieGenerateHelper cookieGenerateHelper;

    private int oauth2_state_expiration_inCookie = 600_000; //60 * 1000 * 10, that is 10 minutes

    public Map<String, String> generateOauth2GoogleLink(HttpServletResponse response) {

        // Store state in a Secure, HttpOnly cookie
        String oauthState = UUID.randomUUID().toString();
        cookieGenerateHelper.generateCookieToResponse("oauth_state",
                oauthState, oauth2_state_expiration_inCookie, true, response);

        // Build Google OAuth2 URL
        String googleAuthUrl = authorization_url +
                "?client_id=" + URLEncoder.encode(client_id, StandardCharsets.UTF_8) +
                "&redirect_uri=" + URLEncoder.encode(redirect_url, StandardCharsets.UTF_8) +
                "&response_type=code" +
                "&scope=" + URLEncoder.encode(String.join(" ", scope), StandardCharsets.UTF_8) +
                "&state=" + URLEncoder.encode(oauthState, StandardCharsets.UTF_8);
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("oauth_url", googleAuthUrl);
        return responseBody;
    }

    public Oauth2CallbackResponse handleCallBack(String authorizationCode, String state,
                                            HttpServletRequest request, HttpServletResponse response) {
        // 1. validate whether state in params is same as state in cookie
        Cookie[] cookies = request.getCookies();
        String stateInCookie = null;
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("oauth_state")) {
                stateInCookie = cookie.getValue();
                break;
            }
        }

        if (stateInCookie == null || !stateInCookie.equals(state)) {
            return new Oauth2CallbackResponse(400, "Invalid OAuth state parameter.");
        }

        // 2. exchange code for access token
        Map<String, Object> tokenResponse = exchangeCodeForAccessToken(authorizationCode);
        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            return new Oauth2CallbackResponse(400, "Failed to retrieve access token");
        }

        // 3. use access token to retrieve user info
        String access_token = (String) tokenResponse.get("access_token");
        Map<String, Object> userInfo = getUserInfo(access_token);
        if (userInfo == null || !userInfo.containsKey("email")) {
            return new Oauth2CallbackResponse(400, "Failed to retrieve user information.");
        } else {
            return new Oauth2CallbackResponse(200, userInfo);
        }
    }

    private Map<String, Object> exchangeCodeForAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("client_id", client_id);
        requestBody.add("client_secret", client_secret);
        requestBody.add("code", code);
        requestBody.add("redirect_uri", redirect_url);
        requestBody.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        //send post request to Google to ask for access token
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(token_url, requestEntity, Map.class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            return Map.of(
                    "access_token", responseBody.get("access_token"),
                    "refresh_token", responseBody.getOrDefault("refresh_token", "")
            );
        }
        return null;
    }

    private Map<String, Object> getUserInfo(String accessToken) {
        //set access token in header
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(user_info_url, HttpMethod.GET, requestEntity, Map.class);
        return response.getBody();
    }

}
