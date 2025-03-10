package com.cozynest.controllers;

import com.cozynest.Helper.CheckAuthenticationHelper;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.dtos.ApiResponse;
import com.cozynest.dtos.FavoriteItemDto;
import com.cozynest.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    @Autowired
    ShopUserRepository shopUserRepository;

    @Autowired
    FavoriteService favoriteService;

    @Autowired
    CheckAuthenticationHelper checkAuthenticationHelper;

    @GetMapping
    public List<FavoriteItemDto> getFavoriteItem(@RequestParam(value = "page", required = true) int page,
                                                 @RequestParam(value = "size", required = true) int size) {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        return favoriteService.getUserFavoriteItemList(userId, page, size);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToFavorite(@RequestParam(value = "productId") UUID productId) throws ChangeSetPersister.NotFoundException {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        ApiResponse response = favoriteService.addToFavorite(userId, productId);
        return new ResponseEntity<>(response.getMessage(), HttpStatus.valueOf(response.getStatus()));
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFromFavorite(@RequestParam(value = "productId") UUID productId) {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        ApiResponse response = favoriteService.removeFromFavorite(userId, productId);
        return new ResponseEntity<>(response.getMessage(), HttpStatus.valueOf(response.getStatus()));
    }


}
