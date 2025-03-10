package com.cozynest.services;

import com.cozynest.Helper.ConvertToDtoListHelper;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.dtos.*;
import com.cozynest.entities.products.product.Product;
import com.cozynest.entities.products.product.ProductVariant;
import com.cozynest.entities.profiles.cart.Cart;
import com.cozynest.entities.profiles.cart.CartItem;
import com.cozynest.repositories.CartItemRepository;
import com.cozynest.repositories.CartRepository;
import com.cozynest.repositories.ProductRepository;
import com.cozynest.repositories.ProductVariantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CartService {

    @Autowired
    CartRedisService cartRedisService;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ConvertToDtoListHelper convertToDtoListHelper;

    @Autowired
    ProductVariantRepository productVariantRepository;

    @Autowired
    CartItemRepository cartItemRepository;

    final int LIMIT_CART_ITEMS = 50;

    public List<CartItemDto> getUserFavoriteItemList(UUID clientId) {
        String redisKey = "cart:" + clientId;

        //use redisKey to fetch from redis
        List<CartItemDto> cartItemDtoList = cartRedisService.getCartList(clientId);

        // if redis found that key, return the list
        if (cartItemDtoList != null && !cartItemDtoList.isEmpty()) {
            return cartItemDtoList;
        }

        // if redis does not found that key, retrieve list form database
        Cart cart = cartRepository.findByClient_Id(clientId);
        if (cart == null) {
            return new LinkedList<>();
        }

        List<CartItem> cartItemList = cart.getCartItems();
        List<CartItemDto> cartItemDtosList = new LinkedList<>();

        convertCartItemListToCartItemDtoList(cartItemList, cartItemDtosList);

        // add to redis
        cartRedisService.saveCartItemsList(clientId, cartItemDtosList);
        return cartItemDtosList;
    }

    @Transactional
    public ApiResponse addToCart(UUID clientId, CartRequest cartRequest) throws ChangeSetPersister.NotFoundException {

        Client client = clientRepository.findById(clientId).get();

        //check cart repo has connected to client or not
        Cart cart = cartRepository.findByClient_Id(client.getId());

        if (cart == null) {
            cart = new Cart();
            cart.setClient(client);
        }

        List<CartItem> cartItemList = cart.getCartItems();
        if (cartItemList == null) {
            cart.setCartItems(new LinkedList<>());
        }

        cartRepository.save(cart);

        //check client has connected to cart or not
        if (client.getCart() == null) {
            client.setCart(cart);
            clientRepository.save(client);
        }

        if (cart.getCartItems().size() >= LIMIT_CART_ITEMS) {
            return new ApiResponse("Cart items cannot be more than " + LIMIT_CART_ITEMS , 400);
        }

        if (cart.getCartItems() != null) {
            boolean isAdded = cart.getCartItems().stream().anyMatch(cartItem ->
                     cartItem.getProduct().getId().equals(cartRequest.getProductId()) &&
                     cartItem.getProductVariant().getId().equals(cartRequest.getProductVariantId()));
            if (isAdded) {
                return new ApiResponse("Product already added.", 409);
            }
        }

        Optional<Product> product = productRepository.findById(cartRequest.getProductId());
        if (!product.isPresent()) {
            return new ApiResponse("Product Id cannot found.", 404);
        }

        Optional<ProductVariant> productVariant = productVariantRepository.findById(cartRequest.getProductVariantId());
        if (!productVariant.isPresent()) {
            return new ApiResponse("Product Variant Id cannot be found.", 404);
        }

        if (productVariant.get().getProduct().getId() != product.get().getId()) {
            return new ApiResponse("Product variants does not belong to that product.", 400);
        }

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product.get());
        cartItem.setProductVariant(productVariant.get());
        cartItem.setQuantity(cartRequest.getQuantity());

        if (!isCartItemAvailableInProductVariant(cartItem, productVariant.get())) {
            return new ApiResponse("Order Quantity exceeds stock", 409);
        }

        cart.getCartItems().add(cartItem);
        cartItem = cartRepository.save(cart).getCartItems().get(cart.getCartItems().size() - 1);
        CartItemDto cartItemDto = convertCartItemToCartItemDto(cartItem);
        cartRedisService.addToCart(clientId, cartItemDto);
        return new ApiResponse("Product added to cart.", 200);
    }

    @Transactional
    public ApiResponse updateCartItemQuantity(UUID userId, UUID cartItemId, int newQuantity) {
        String redisKey = "cart:" + userId;
        Optional<CartItem> cartItem = cartItemRepository.findById(cartItemId);
        if (!cartItem.isPresent()) {
            return new ApiResponse("Cart item id is not found.", 404);
        }
        ProductVariant productVariant = cartItem.get().getProductVariant();
        int stockQuantity = cartItem.get().getProductVariant().getStockQuantity();
        if (newQuantity > stockQuantity || stockQuantity <= 0) {
            return new ApiResponse("Order item exceed stock quantity.", 400);
        }

        CartItemDto cartItemDto = convertCartItemToCartItemDto(cartItem.get());
        cartItem.get().setQuantity(newQuantity);
        if (!cartRedisService.isSuccessReplaceCartItemWithOldTimestampInList(userId, cartItemDto)) {
            List<CartItemDto> cartItemDtoList = new LinkedList<>();
            Optional<Client> client = clientRepository.findById(userId);
            Cart cart = client.get().getCart();
            convertCartItemListToCartItemDtoList(cart.getCartItems(), cartItemDtoList);
            cartRedisService.saveCartItemsList(userId, cartItemDtoList);
        }
        return new ApiResponse("Quantity successfully updated.", 200);

    }


    @Transactional
    public ApiResponse removeItemFromCart(UUID userId, UUID cartItemId) {
        Optional<CartItem> cartItem = cartItemRepository.findById(cartItemId);
        if (!cartItem.isPresent()) {
            return new ApiResponse("Cart item id cannot found", 404);
        }

        Optional<Client> client = clientRepository.findById(userId);
        Cart cart = client.get().getCart();
        boolean removed = cart.getCartItems().remove(cartItem.get()); //use link list, iterate big o n, remove constant

        if (!removed) {
            return new ApiResponse("Cart item not found in cart", 400);
        }
        cartItemRepository.delete(cartItem.get());

        //update redis
        cartRedisService.removeFromCart(userId, cartItemId);

        return new ApiResponse("Cart item successfully removed.", 200);
    }

    private CartItemDto convertCartItemToCartItemDto(CartItem cartItem) {
        CartItemDto cartItemDto = new CartItemDto();
        cartItemDto.setCartItemId(cartItem.getId());
        Product product = cartItem.getProduct();
        cartItemDto.setProductId(product.getId());

        List<ProductTranslationDto> productTranslationDtoList = convertToDtoListHelper.getProductTranslationDtoList(product);
        cartItemDto.setProductTranslationDtoList(productTranslationDtoList);

        cartItemDto.setProductPrice(product.getPrice());
        cartItemDto.setCategory(product.getCategory().getCode());
        cartItemDto.setCategoryType(product.getCategoryType().getCode());

        ProductVariant productVariant = cartItem.getProductVariant();
        ProductVariantDto productVariantDto = convertToDtoListHelper.convertProductVariantDto(productVariant);
        cartItemDto.setProductVariantDto(productVariantDto);
        cartItemDto.setQuantity(cartItem.getQuantity());
        cartItemDto.setPrimaryProductDisplayDto(convertToDtoListHelper.getPrimaryProductDisplayDetail(product));
        return cartItemDto;
    }

    private void convertCartItemListToCartItemDtoList(List<CartItem> cartItemList, List<CartItemDto> cartItemDtosList) {
        for (CartItem cartItem : cartItemList) {
            CartItemDto cartItemDto = convertCartItemToCartItemDto(cartItem);
            cartItemDtosList.add(cartItemDto);
        }
    }

    private boolean isCartItemAvailableInProductVariant(CartItem cartItem, ProductVariant productVariant) {
        if (!cartItem.getProductVariant().getId().equals(productVariant.getId())) {
            return false;
        }
        if (productVariant.getStockQuantity() == 0 || cartItem.getQuantity() > productVariant.getStockQuantity()) {
            return false;
        }
        return true;
    }
}
