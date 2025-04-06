package com.cozynest.services;

import com.cozynest.auth.config.RestTempWithProxy;
import com.cozynest.dtos.ChatMessageDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class AICartService {

    @Autowired
    @Qualifier("StringRedisTemplate")
    RedisTemplate<String, String> redisTemplate;

    @Autowired
    ObjectMapper objectMapper;

    @Value("${ai.api.url}")
    private String aiApiUrl;

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.system.prompt}")
    private String systemPrompt;

    @Autowired
    RestTempWithProxy restTempWithProxy;

    static final int REDIS_CHAT_BOX_KEY_EXPIRE_IN_HOUR = 1;

    public String getAIReply(String userMessage, String sessionId) throws Exception {
        String redisKey = "chat-history:" + sessionId;
        LinkedList<ChatMessageDto> chatHistory = new LinkedList<>();
        
        // Add default welcome message
        chatHistory.add(new ChatMessageDto("assistant", "Hello and welcome to CozyNest! 😊 How can I assist you today?"));
        
        // Try to retrieve and parse chat history from Redis
        String storedHistoryJson = redisTemplate.opsForValue().get(redisKey);
        if (storedHistoryJson != null) {
            try {
                // First check if it's a JSON array
                JsonNode jsonNode = objectMapper.readTree(storedHistoryJson);
                if (jsonNode.isArray()) {
                    // If it's an array, deserialize as a list
                    chatHistory = objectMapper.readValue(storedHistoryJson, 
                        new TypeReference<LinkedList<ChatMessageDto>>() {});
                } else {
                    // If it's not an array, clear and initialize with default message
                    System.out.println("Found invalid chat history format in Redis, resetting: " + storedHistoryJson);
                    chatHistory = new LinkedList<>();
                    chatHistory.add(new ChatMessageDto("assistant", "Hello and welcome to CozyNest! 😊 How can I assist you today?"));
                }
            } catch (Exception e) {
                // If parsing fails, log and use default
                System.err.println("Error parsing chat history from Redis: " + e.getMessage() + ", Data: " + storedHistoryJson);
                chatHistory = new LinkedList<>();
                chatHistory.add(new ChatMessageDto("assistant", "Hello and welcome to CozyNest! 😊 How can I assist you today?"));
            }
        }

        if (userMessage != null && !userMessage.trim().isEmpty()) {
            chatHistory.add(new ChatMessageDto("user", userMessage));
        } else {
            throw new Exception("User Message is empty");
        }

        // Create a copy without the system prompt for storage
        LinkedList<ChatMessageDto> chatHistoryForStorage = new LinkedList<>(chatHistory);
        
        // Add system prompt at the beginning for the API call
        List<Map<String, String>> formattedMessages = new ArrayList<>();
        // Add system prompt first
        String safeSystemPrompt = systemPrompt != null ? systemPrompt : "You are a helpful shopping assistant for CozyNest, an online home furniture store.";
        formattedMessages.add(Map.of("role", "system", "content", safeSystemPrompt));
        
        // Then add the chat history
        for (ChatMessageDto messageDto : chatHistory) {
            // Add null checks to avoid NullPointerException in Map.of()
            String role = messageDto.getRole() != null ? messageDto.getRole() : "user";
            String content = messageDto.getContent() != null ? messageDto.getContent() : "";
            formattedMessages.add(Map.of("role", role, "content", content));
        }

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o",
                "messages", formattedMessages,
                "temperature", 1,
                "max_completion_tokens", 2048,
                "top_p", 1,
                "frequency_penalty", 0,
                "presence_penalty", 0,
                "store", false
        );

        // Log request details for debugging
        System.out.println("AI API Request - URL: " + aiApiUrl);
        System.out.println("AI API Request - Messages count: " + formattedMessages.size());
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            // Log before making the request
            System.out.println("Sending request to AI API...");
            
            ResponseEntity<Map<String, Object>> response = restTempWithProxy.restTemplateWithProxy().exchange(
                    aiApiUrl,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            // Log response details
            System.out.println("AI API Response - Status code: " + response.getStatusCode());
            
            // Add null checking and error handling for the API response
            Map<String, Object> responseBody = response.getBody();
            String aiReply;
            
            System.out.println("AI API Response - Body: " + responseBody);
            
            // Extract the reply from the OpenAI response format
            try {
                // Ensure the "choices" is a valid array or list
                Object choicesObj = responseBody.get("choices");
                if (choicesObj instanceof ArrayList<?>) {
                    List<Map<String, Object>> choicesList = (ArrayList<Map<String, Object>>) choicesObj;
                    if (!choicesList.isEmpty()) {
                        // Extract the "message" content from the first choice
                        Map<String, Object> firstChoice = choicesList.get(0);
                        Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                        aiReply = (String) message.get("content");
                    } else {
                        aiReply = "I'm sorry, I couldn't process your request at the moment. Please try again later.";
                    }
                } else {
                    aiReply = "I'm sorry, I couldn't process your request at the moment. Please try again later.";
                }
            } catch (Exception e) {
                System.err.println("Error extracting content from response: " + e.getMessage());
                aiReply = "I'm sorry, I couldn't process your request at the moment. Please try again later.";
            }
            
            chatHistoryForStorage.add(new ChatMessageDto("assistant", aiReply));

            try {
                // Store the chat history as a JSON array string
                String chatHistoryJson = objectMapper.writeValueAsString(chatHistoryForStorage);
                redisTemplate.opsForValue().set(redisKey, chatHistoryJson, REDIS_CHAT_BOX_KEY_EXPIRE_IN_HOUR, TimeUnit.HOURS);
                System.out.println("Chat history saved successfully to Redis");
            } catch (JsonProcessingException e) {
                System.err.println("Error storing chat history to Redis: " + e.getMessage());
                // Continue even if storage fails
            }

            return aiReply;
        } catch (Exception e) {
            System.err.println("Exception when calling AI API: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw for controller to handle
        }
    }

    public List<ChatMessageDto> getChatMessageDto(String sessionId) {
        String redisKey = "chat-history:" + sessionId;
        String storedHistoryJson = redisTemplate.opsForValue().get(redisKey);
        if (storedHistoryJson == null) {
            return new ArrayList<>();
        }
        
        try {
            // First check if it's a JSON array
            JsonNode jsonNode = objectMapper.readTree(storedHistoryJson);
            if (jsonNode.isArray()) {
                // If it's an array, deserialize as a list
                return objectMapper.readValue(storedHistoryJson, 
                    new TypeReference<List<ChatMessageDto>>() {});
            } else {
                System.out.println("Found invalid chat history format in Redis: " + storedHistoryJson);
                return new ArrayList<>();
            }
        } catch (IOException e) {
            System.err.println("Error parsing chat history from Redis: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
