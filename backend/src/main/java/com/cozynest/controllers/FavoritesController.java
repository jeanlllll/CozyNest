package com.cozynest.controllers;

import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.dtos.ApiResponse;
import com.cozynest.dtos.FavoriteItemDto;
import com.cozynest.services.FavoritesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/favorites")
public class FavoritesController {

    @Autowired
    ShopUserRepository shopUserRepository;

    @Autowired
    FavoritesService favoritesService;

    @GetMapping
    public List<FavoriteItemDto> getFavoriteItem(@RequestParam(value = "page", required = true) int page,
                                                 @RequestParam(value = "size", required = true) int size) {
        UUID userId = getUserIdViaAuthentication();
        return favoritesService.getUserFavoriteItemList(userId, page, size);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToFavorite(@RequestParam(value = "productId") UUID productId) throws ChangeSetPersister.NotFoundException {
        UUID userId = getUserIdViaAuthentication();
        ApiResponse response = favoritesService.addToFavorite(userId, productId);
        return new ResponseEntity<>(response.getMessage(), HttpStatus.valueOf(response.getStatus()));
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFromFavorite(@RequestParam(value = "productId") UUID productId) {
        UUID userId = getUserIdViaAuthentication();
        ApiResponse response = favoritesService.removeFromFavorite(userId, productId);
        return new ResponseEntity<>(response.getMessage(), HttpStatus.valueOf(response.getStatus()));
    }

    private UUID getUserIdViaAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ShopUser shopUser = shopUserRepository.findByEmail(email);
        if (shopUser == null) {
            throw new IllegalStateException("User not found");
        }
        return shopUser.getId();
    }
}
