package com.cozynest.controllers;

import com.cozynest.dtos.ChatMessageDto;
import com.cozynest.dtos.ChatRequest;
import com.cozynest.services.AICartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    @Autowired
    AICartService aiCartService;

    @PostMapping("/chat")
    public ResponseEntity<?> chatWithAgent(@RequestBody ChatRequest chatRequest) {
        try {
            // Validate input
            if (chatRequest == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Request body cannot be null"));
            }
            
            String userMessage = chatRequest.getMessage();
            String sessionId = chatRequest.getSessionId();
            
            if (userMessage == null || userMessage.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
            }
            
            if (sessionId == null || sessionId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Session ID cannot be empty"));
            }
            
            // Get AI reply
            String aiReply = aiCartService.getAIReply(userMessage, sessionId);
            
            // Return response
            Map<String, String> response = new HashMap<>();
            response.put("reply", aiReply);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            
            // Return error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to process chat request");
            errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "Unknown error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory(@RequestParam String sessionId) {
        try {
            // Validate input
            if (sessionId == null || sessionId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Session ID cannot be empty"));
            }

            List<ChatMessageDto> chatMessageDtoList = aiCartService.getChatMessageDto(sessionId);
            return ResponseEntity.ok(chatMessageDtoList);
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            
            // Return error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve chat history");
            errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "Unknown error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
