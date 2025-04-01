package com.cozynest.services;

import com.cozynest.Helper.ConvertToDtoListHelper;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.dtos.*;
import com.cozynest.entities.products.product.Product;
import com.cozynest.entities.products.product.ProductVariant;
import com.cozynest.entities.profiles.favorites.Favorite;
import com.cozynest.entities.profiles.favorites.FavoriteItem;
import com.cozynest.repositories.FavoriteRepository;
import com.cozynest.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.UUID;

@Service
public class FavoriteService {

    @Autowired
    FavoriteRepository favoriteRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ConvertToDtoListHelper convertToDtoListHelper;

    final int LIMIT_FAVORITES_ITEMS = 50;

    public List<FavoriteItemDto> getUserFavoriteItemList(UUID clientId) {
        Client client = clientRepository.findById(clientId).get();
        Favorite favorite = client.getFavorite();
        List<FavoriteItem> favoriteItemList = favorite.getFavoriteItems();
        return convertFavoriteItemListToDtoListNSort(favoriteItemList);
    }

    @Transactional
    public List<FavoriteItemDto> addToFavorite(UUID clientId, UUID productId) throws Exception {

        Client client = clientRepository.findById(clientId).get();
        Favorite favorite = client.getFavorite();

        if (favorite == null) {
            favorite = new Favorite();
            favorite.setClient(client);
            favorite.setFavoriteItems(new ArrayList<>());
            client.setFavorite(favorite);
            clientRepository.save(client);
        }

        if (favorite.getFavoriteItems().size() >= LIMIT_FAVORITES_ITEMS) {
            throw new Exception("Favorite list exceeds the allowed limit of " + LIMIT_FAVORITES_ITEMS + " items.");
        }


        if (favorite.getFavoriteItems() != null &&
                favorite.getFavoriteItems().stream()
                        .anyMatch(item -> item.getProduct().getId().equals(productId))) {
            throw new Exception("Product already in favorites.");
        }

        Optional<Product> product = productRepository.findById(productId);
        if (!product.isPresent()) {
            throw new Exception("Product not found.");
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

        return convertFavoriteItemListToDtoListNSort(favorite.getFavoriteItems());
    }

    @Transactional
    public List<FavoriteItemDto> removeFromFavorite(UUID clientId, UUID productId) throws Exception {
        if (!productRepository.findById(productId).isPresent()) {
            throw new Exception("Product not found.");
        }

        Favorite favorite = favoriteRepository.findByClient_Id(clientId);
        favorite.getFavoriteItems().removeIf(item -> item.getProduct().getId().equals(productId)); //directly remove from the list
        List<FavoriteItem> favoriteItemList = favorite.getFavoriteItems();
        favoriteRepository.save(favorite);

        return convertFavoriteItemListToDtoListNSort(favorite.getFavoriteItems());
    }


    private List<FavoriteItemDto> convertFavoriteItemListToDtoListNSort(List<FavoriteItem> favoriteItemList) {
        List<FavoriteItemDto> favoriteItemDtosList = new ArrayList<>();
        convertFavoriteItemListToFavoriteItemDtoList(favoriteItemList, favoriteItemDtosList);
        // Sort by addDateTime (most recent first)
        favoriteItemDtosList.sort((a, b) -> b.getAddDateTime().compareTo(a.getAddDateTime()));
        return favoriteItemDtosList;
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
        favoriteItemDto.setProductPrice(product.getPrice());
        favoriteItemDto.setIsOutOfStock(product.getIsOutOfStock());

        favoriteItemDto.setProductDisplayDto(convertToDtoListHelper.getProductDisplayDtoList(product));
        favoriteItemDto.setAddDateTime(favoriteItem.getAddDateTime());

        favoriteItemDto.setCategory(product.getCategory().getCode());
        favoriteItemDto.setCategoryTypes(product.getCategoryType().getCode());

        List<ProductVariant> productVariantList = product.getProductVariants();
        List<ProductVariantDto> productVariantDtoList = new ArrayList<>();
        for (ProductVariant productVariant : productVariantList) {
            ProductVariantDto productVariantDto = convertToDtoListHelper.convertProductVariantDto(productVariant);
            productVariantDtoList.add(productVariantDto);
        }

        return favoriteItemDto;
    }
}
