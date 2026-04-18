package com.example.demo.controller;

import com.example.demo.dto.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void processMessage(@Payload ChatMessage chatMessage) {
        // Sends the explicit message payload to /user/{receiverId}/queue/messages natively!
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverId(), 
                "/queue/messages", 
                chatMessage
        );
    }
}
