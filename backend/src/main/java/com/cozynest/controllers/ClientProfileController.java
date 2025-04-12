package com.cozynest.controllers;

import com.cozynest.Helper.BindingResultHelper;
import com.cozynest.Helper.CheckAuthenticationHelper;
import com.cozynest.dtos.ApiResponse;
import com.cozynest.dtos.ProfileDto;
import com.cozynest.services.ClientProfileService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.bind.BindResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/client/profile")
public class ClientProfileController {

    @Autowired
    CheckAuthenticationHelper checkAuthenticationHelper;

    @Autowired
    ClientProfileService clientProfileService;

    @Autowired
    BindingResultHelper bindingResultHelper;

    @GetMapping
    public ResponseEntity<ProfileDto> getProfile() {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        return ResponseEntity.ok(clientProfileService.getClientProfile(userId));
    }

    @PutMapping
    public ResponseEntity<ProfileDto> postProfile(@Valid @RequestBody ProfileDto profileDto, BindingResult result) throws Exception {
        ResponseEntity errorResponse = bindingResultHelper.convertBindErrorToResponse(result);
        if (errorResponse != null ) return errorResponse;
        try {
            UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
            ProfileDto upatedProfileDto = clientProfileService.updateClientProfile(userId, profileDto);
            return ResponseEntity.ok(upatedProfileDto);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

    }
}
