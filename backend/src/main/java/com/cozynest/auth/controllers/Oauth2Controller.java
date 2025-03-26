package com.cozynest.auth.controllers;

import com.cozynest.auth.dtos.Oauth2CallbackResponse;
import com.cozynest.auth.dtos.RegistrationRequest;
import com.cozynest.auth.dtos.RegistrationResponse;
import com.cozynest.auth.entities.AuthProvider;
import com.cozynest.auth.services.LoginService;
import com.cozynest.auth.services.Oauth2Service;
import com.cozynest.auth.services.RegistrationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/oauth2/google")
public class Oauth2Controller {

    @Autowired
    private Oauth2Service oauth2Service;

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private LoginService loginService;

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> getOauth2GoogleLink(HttpServletResponse response) {
        Map<String, String> responseBody = oauth2Service.generateOauth2GoogleLink(response);
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping("/callback")
    public ResponseEntity<?> handleOauth2Callback(@RequestParam("code") String authorizationCode, @RequestParam("state") String state,
                                                  HttpServletRequest request, HttpServletResponse response) {
        Oauth2CallbackResponse callbackResponse = oauth2Service.handleCallBack(authorizationCode, state, request, response);
        if (callbackResponse.getCode() != 200) {
            return new ResponseEntity<>(callbackResponse.getResponse(), HttpStatusCode.valueOf(callbackResponse.getCode()));
        }
        Map<String, Object> responesMap = (Map<String, Object>) callbackResponse.getResponse();
        String email = (String) responesMap.get("email");
        String firstName = (String) responesMap.get("given_name");
        String lastName = (String) responesMap.get("family_name");

        //if oauth2 client already register, then login
        if (registrationService.isRegistered(email)) {
            return loginService.login(email, null, response, AuthProvider.GOOGLE);
        } else {
            //if oauth2 client not yet register, then register
            RegistrationRequest registrationRequest = new RegistrationRequest(firstName, lastName, email, "", "");
            RegistrationResponse registrationResponse = registrationService.createUser(registrationRequest, AuthProvider.GOOGLE);
            return ResponseEntity.ok(registrationResponse);
        }


    }
}
