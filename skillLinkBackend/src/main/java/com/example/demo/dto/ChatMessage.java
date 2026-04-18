package com.example.demo.dto;

import lombok.Data;

@Data
public class ChatMessage {
    private String senderId;
    private String receiverId;
    private String senderName;
    private String content;
    private String type; // Expected values: CHAT, JOIN, LEAVE
}
