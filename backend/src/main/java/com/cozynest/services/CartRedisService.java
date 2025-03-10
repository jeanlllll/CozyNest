package com.cozynest.services;

import com.cozynest.dtos.CartItemDto;
import com.cozynest.entities.profiles.cart.CartItem;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class CartRedisService {

    @Autowired
    RedisTemplate<String, Object> redisTemplate;

    @Autowired
    ObjectMapper objectMapper;

    private static final long CART_TTL = 1;


    //Replace Entire Cart List (WITHOUT Keeping Old Timestamp), big o N
    public void saveCartItemsList(UUID userId, List<CartItemDto> cartItemDtosList) {
        // here use sorted set in redis, as it can update the partial one by creating a new key value set  by using old timestamp as timestamp key
        String redisKey = "cart:" + userId;
        redisTemplate.delete(redisKey);

        for (CartItemDto cartItemDto : cartItemDtosList) {
            addToCart(userId, cartItemDto);
        }

        setTTLtoKey(redisKey);
    }

    // Update Single Cart Item (Keeping Existing Timestamp), iterate big o worst case is N, insert constant
    public boolean isSuccessReplaceCartItemWithOldTimestampInList(UUID userId, CartItemDto cartItemDto) {
        String redisKey = "cart:" + userId;

        // Retrieve all cart items with their timestamps
        Set<ZSetOperations.TypedTuple<Object>> cartItemsWithScores = redisTemplate.opsForZSet().rangeWithScores(redisKey, 0, -1);

        if (cartItemsWithScores == null || cartItemsWithScores.isEmpty()) {
            return false;
        }

        String updatedCartItemJson;
        try {
            updatedCartItemJson = objectMapper.writeValueAsString(cartItemDto);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting updated CartItemDto to JSON", e);
        }

        Double oldTimestamp = null;
        String existingCartItemJson = null;

        for (ZSetOperations.TypedTuple<Object> cartItem : cartItemsWithScores) {
            try {
                String cartItemJson = (String) cartItem.getValue();
                //retrieve json value from object, and then convert it to cartItemDto object, in order to get cartItemDto id
                CartItemDto existingCartItemDto = objectMapper.readValue(cartItemJson, CartItemDto.class);

                if (existingCartItemDto.getProductId().equals(cartItemDto.getProductId())) {
                    oldTimestamp = cartItem.getScore();
                    existingCartItemJson = (String) cartItem.getValue();
                    break;
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error parsing CartItem from JSON", e);
            }
        }

        if (oldTimestamp == null) {
            return false;
        }

        //remove the old cart item
        redisTemplate.opsForZSet().remove(redisKey, existingCartItemJson);

        // add update cart item with same old timestamp
        redisTemplate.opsForZSet().add(redisKey, updatedCartItemJson, oldTimestamp);

        return true;
    }

    public List<CartItemDto> getCartList(UUID userId) {
        String redisKey = "cart:" + userId;

        //return sorted set only with key and json value, not including timestamp
        Set<Object> rawCartItemSet = redisTemplate.opsForZSet().range(redisKey, 0, -1);

        if (rawCartItemSet == null || rawCartItemSet.isEmpty()) {
            return null;
        }

        List<CartItemDto> cartItemDtoList = new ArrayList<>();
        for (Object json : rawCartItemSet) {
            try {
                CartItemDto cartItemDto = objectMapper.readValue((String) json, CartItemDto.class);
                cartItemDtoList.add(cartItemDto);
            } catch (Exception e) {
                throw new RuntimeException("Error converting JSON to FavoriteItemDto", e);
            }

        }
        return cartItemDtoList;
    }

    public void addToCart(UUID userId, CartItemDto cartItemDto) {
        String redisKey = "cart:" + userId;
        try {
            String jsonValue = objectMapper.writeValueAsString(cartItemDto);
            redisTemplate.opsForZSet().add(redisKey, jsonValue, System.currentTimeMillis());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting FavoriteItemDto to JSON", e);
        }

        setTTLtoKey(redisKey);
    }

    public void removeFromCart(UUID userId,  UUID cartItemId){
        String redisKey = "cart:" + userId;
        Set<Object> cartItemDtoSet = redisTemplate.opsForZSet().range(redisKey, 0, -1);

        if (cartItemDtoSet == null || cartItemDtoSet.isEmpty()) {
            return;
        }

        String existingCartItemJson = null;
        for (Object cartItemDto : cartItemDtoSet) {
            try {
                CartItemDto existingCartItemDto = objectMapper.readValue((String) cartItemDto, CartItemDto.class);

                if (existingCartItemDto.getCartItemId().equals(cartItemId)) {
                    existingCartItemJson = (String) cartItemDto;
                    break;
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error parsing CartItemDto from Redis JSON", e);
            }
        }

        if (existingCartItemJson == null) {
            return;
        }

        redisTemplate.opsForZSet().remove(redisKey, existingCartItemJson);
    }

    //if key expire not set, set it to 1 hour, it only set in the first time
    private void setTTLtoKey(String redisKey) {
        Long currentTtl = redisTemplate.getExpire(redisKey, TimeUnit.SECONDS);
        if (currentTtl == null || currentTtl == -1) { // -1 means no TTL is set
            redisTemplate.expire(redisKey, CART_TTL, TimeUnit.HOURS);
        }
    }

}
