package com.cozynest.services;

import com.cozynest.dtos.ProductDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class ProductRedisService {

    @Autowired
    RedisTemplate<String, Object> redisTemplate;

    @Autowired
    ObjectMapper objectMapper;

    private static final String REDIS_KEY = "HomeProducts";
    private static final long EXPIRATION_HOUR = 6;

    public Map<String, List<ProductDto>> getTrendingProductsFromRedis() throws IOException {
        Object categoryHomeJsonList = redisTemplate.opsForValue().get(REDIS_KEY);

        if (categoryHomeJsonList instanceof String jsonString) {
            return objectMapper.readValue(jsonString, new TypeReference<Map<String, List<ProductDto>>>() {});
        }

        return null;
    }

    public void saveTrendingProductsToRedis(Map<String, List<ProductDto>> map) {
        try {
            String jsonValue = objectMapper.writeValueAsString(map); //convert object to json
            //save as key value
            redisTemplate.opsForValue().set(REDIS_KEY, jsonValue, 6, TimeUnit.HOURS);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize trending products", e);
        }
    }
}
