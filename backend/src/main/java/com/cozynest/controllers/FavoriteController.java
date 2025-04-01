package com.cozynest.controllers;

import com.cozynest.Helper.CheckAuthenticationHelper;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.dtos.FavoriteItemDto;
import com.cozynest.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    ShopUserRepository shopUserRepository;

    @Autowired
    FavoriteService favoriteService;

    @Autowired
    CheckAuthenticationHelper checkAuthenticationHelper;

    @GetMapping
    public ResponseEntity<?> getFavoriteItem() {
        UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
        List<FavoriteItemDto> favoriteItemDtoList = favoriteService.getUserFavoriteItemList(userId);
        return ResponseEntity.ok(favoriteItemDtoList);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToFavorite(@RequestParam(value = "productId") UUID productId) throws Exception {
        try {
            UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
            List<FavoriteItemDto> favoriteItemDtoList = favoriteService.addToFavorite(userId, productId);
            return ResponseEntity.ok(favoriteItemDtoList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFromFavorite(@RequestParam(value = "productId") UUID productId) {
        try {
            UUID userId = checkAuthenticationHelper.getUserIdViaAuthentication();
            List<FavoriteItemDto> favoriteItemDtoList = favoriteService.removeFromFavorite(userId, productId);
            return ResponseEntity.ok(favoriteItemDtoList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
