package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enables a simple in-memory broker, pushing messages to clients on /user and /topic
        config.enableSimpleBroker("/user", "/topic");
        
        // Defines the prefix for messages sent FROM clients TO the server (e.g., /app/chat.sendMessage)
        config.setApplicationDestinationPrefixes("/app");
        
        // Defines the prefix used to target specific users
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Registers the /ws endpoint for clients to connect, using SockJS fallback mechanism
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}
