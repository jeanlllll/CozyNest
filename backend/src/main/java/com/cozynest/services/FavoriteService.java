package com.cozynest.services;

import com.cozynest.Helper.ConvertToDtoListHelper;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.dtos.*;
import com.cozynest.entities.products.product.Product;
import com.cozynest.entities.products.product.ProductDisplay;
import com.cozynest.entities.products.product.ProductTranslation;
import com.cozynest.entities.products.product.ProductVariant;
import com.cozynest.entities.profiles.favorites.Favorite;
import com.cozynest.entities.profiles.favorites.FavoriteItem;
import com.cozynest.repositories.FavoriteRepository;
import com.cozynest.repositories.LanguageRepository;
import com.cozynest.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FavoriteService {

    @Autowired
    FavoriteRedisService favoriteRedisService;

    @Autowired
    FavoriteRepository favoriteRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ConvertToDtoListHelper convertToDtoListHelper;

    final int LIMIT_FAVORITES_ITEMS = 50;

    public List<FavoriteItemDto> getUserFavoriteItemList(UUID clientId, int page, int size) {
        String redisKey = "favorite:" + clientId;

        //use redisKey to fetch from redis
        List<FavoriteItemDto> favoriteItemDtoList = favoriteRedisService.getPagedFavoritesItems(clientId, page, size);

        // if redis found that key, return the list
        if (favoriteItemDtoList != null && !favoriteItemDtoList.isEmpty()) {
            return favoriteItemDtoList;
        }

        // if redis does not found that key, retrieve list form database
        Favorite favorite = favoriteRepository.findByClient_Id(clientId);
        if (favorite == null) {
            // If there is no favorite record for this user, return an empty list.
            return new ArrayList<>();
        }

        List<FavoriteItem> favoriteItemList = favorite.getFavoriteItems();
        List<FavoriteItemDto> favoriteItemDtosList = new ArrayList<>();

        convertFavoriteItemListToFavoriteItemDtoList(favoriteItemList, favoriteItemDtosList);

        // Sort by addDateTime (most recent first)
        favoriteItemDtosList.sort((a, b) -> b.getAddDateTime().compareTo(a.getAddDateTime()));

        // add to redis
        favoriteRedisService.saveFavoriteItemList(clientId, favoriteItemDtosList);
        return favoriteItemDtosList;
    }

    @Transactional
    public ApiResponse addToFavorite(UUID clientId, UUID productId) throws ChangeSetPersister.NotFoundException {

        Favorite favorite = favoriteRepository.findByClient_Id(clientId);

        if (favorite == null) {
            favorite = new Favorite();
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new ChangeSetPersister.NotFoundException());
            favorite.setClient(client);
            favorite.setFavoriteItems(new ArrayList<>());
        }

        if (favorite.getFavoriteItems().size() >= LIMIT_FAVORITES_ITEMS) {
            return new ApiResponse("Favorites items cannot be more than " + LIMIT_FAVORITES_ITEMS, 400);
        }


        if (favorite.getFavoriteItems() != null &&
                favorite.getFavoriteItems().stream()
                        .anyMatch(item -> item.getProduct().getId().equals(productId))) {
            return new ApiResponse("Product already added.", 409);
        }

        Optional<Product> product = productRepository.findById(productId);
        if (!product.isPresent()) {
            return new ApiResponse("Product Id cannot found.", 404);
        }

        List<FavoriteItem> favoriteItemList = favorite.getFavoriteItems();
        if ( favoriteItemList == null) {
            favorite.setFavoriteItems(new ArrayList<>());
        }

        FavoriteItem favoriteItem = new FavoriteItem();
        favoriteItem.setProduct(product.get());
        favoriteItem.setFavorite(favorite);
        favoriteItem.setAddDateTime(LocalDateTime.now());

        favorite.getFavoriteItems().add(favoriteItem);
        favoriteRepository.save(favorite);

        FavoriteItemDto favoriteItemDto = convertToDto(favoriteItem);
        favoriteRedisService.addToFavorite(clientId, favoriteItemDto);

        return new ApiResponse("Product added to favorite.", 200);
    }

    @Transactional
    public ApiResponse removeFromFavorite(UUID clientId, UUID productId) {
        if (!productRepository.findById(productId).isPresent()) {
            return new ApiResponse("Product Id cannot found", 404);
        }

        Favorite favorite = favoriteRepository.findByClient_Id(clientId);
        favorite.getFavoriteItems().removeIf(item -> item.getProduct().getId().equals(productId)); //directly remove from the list
        List<FavoriteItem> favoriteItemList = favorite.getFavoriteItems();
        favoriteRepository.save(favorite);

        List<FavoriteItemDto> favoriteItemDtosList = new ArrayList<>();
        convertFavoriteItemListToFavoriteItemDtoList(favorite.getFavoriteItems(), favoriteItemDtosList);

        // Sort by addDateTime (most recent first)
        favoriteItemDtosList.sort((a, b) -> b.getAddDateTime().compareTo(a.getAddDateTime()));

        favoriteRedisService.saveFavoriteItemList(clientId, favoriteItemDtosList);
        return new ApiResponse("Product removed from favorite.", 200);
    }


    private void convertFavoriteItemListToFavoriteItemDtoList(List<FavoriteItem> favoriteItemList, List<FavoriteItemDto> favoriteItemDtosList) {
        for (FavoriteItem favoriteItem : favoriteItemList) {
            FavoriteItemDto favoriteItemDto = convertToDto(favoriteItem);
            favoriteItemDtosList.add(favoriteItemDto);
        }
    }

    private FavoriteItemDto convertToDto(FavoriteItem favoriteItem) {
        FavoriteItemDto favoriteItemDto = new FavoriteItemDto();
        Product product = favoriteItem.getProduct();
        favoriteItemDto.setProductId(product.getId());

        List<ProductTranslationDto> productTranslationDtoList = convertToDtoListHelper.getProductTranslationDtoList(product);
        favoriteItemDto.setProductTranslationDtoList(productTranslationDtoList);
        favoriteItemDto.setPrice(product.getPrice());
        favoriteItemDto.setIsOutOfStock(product.getIsOutOfStock());

        favoriteItemDto.setProductDisplayDto(convertToDtoListHelper.getProductDisplayDetail(product));
        favoriteItemDto.setAddDateTime(favoriteItem.getAddDateTime());

        List<ProductVariant> productVariantList = product.getProductVariants();
        List<ProductVariantDto> productVariantDtoList = new ArrayList<>();
        for (ProductVariant productVariant : productVariantList) {
            ProductVariantDto productVariantDto = convertToDtoListHelper.convertProductVariantDto(productVariant);
            productVariantDtoList.add(productVariantDto);
        }

        favoriteItemDto.setProductVariantDtoList(productVariantDtoList);
        return favoriteItemDto;
    }

}
