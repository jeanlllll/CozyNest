package com.cozynest.services;

import com.cozynest.dtos.FavoriteItemDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class FavoritesRedisService {


    @Autowired
    RedisTemplate<String, String> redisTemplate;

    @Autowired
    ObjectMapper objectMapper;

    public void saveFavoriteItemList(UUID userId, List<FavoriteItemDto> favoriteItemList) {
        // add to redis - big o constant as the largest is 50 favoriteItem in a list
        String redisKey = "favorite:" + userId;
        redisTemplate.delete(redisKey);
        for (FavoriteItemDto favoriteItemDto : favoriteItemList) {
            try {
                String jsonValue = objectMapper.writeValueAsString(favoriteItemDto);
                redisTemplate.opsForList().rightPush(redisKey, jsonValue);

                //if key expire not set, set it to 1 hour, it only set in the first time
                Long currentTtl = redisTemplate.getExpire(redisKey, TimeUnit.SECONDS);
                if (currentTtl == null || currentTtl == -1) { // -1 means no TTL is set
                    redisTemplate.expire(redisKey, 1, TimeUnit.HOURS);
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error converting FavoriteItem to Json", e);
            }
        }
    }

    public List<FavoriteItemDto> getPagedFavoritesItems(UUID userId, int page, int size) {
        String redisKey = "favorite:" + userId;
        int start = page * size;
        int end = start + size  - 1;

        // big O is N, but the largest favorite item is 50, set it is close to constant
        List<String> rawFavorites = redisTemplate.opsForList().range(redisKey, start, end);

        if (rawFavorites == null || rawFavorites.isEmpty()) {
            return null;
        }

        List<FavoriteItemDto> favoriteItemDtoList = new ArrayList<>();
        for (String json : rawFavorites) {
            try {
                FavoriteItemDto favoriteItemDto = objectMapper.readValue(json, FavoriteItemDto.class);
                favoriteItemDtoList.add(favoriteItemDto);
            } catch (Exception e) {
                throw new RuntimeException("Error converting JSON to FavoriteItemDto", e);
            }

        }
        return favoriteItemDtoList;

    }

    public void addToFavorite(UUID userId, FavoriteItemDto favoriteItemDto) {
        String redisKey = "favorite:" + userId;
        try {
            String jsonValue = objectMapper.writeValueAsString(favoriteItemDto);
            redisTemplate.opsForList().leftPush(redisKey, jsonValue);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting FavoriteItemDto to JSON", e);
        }
    }

}
