package com.example.demo.service;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userOpt.get();
        if (BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            return new AuthResponse("Login successful", user.getUserID());
        } else {
            throw new IllegalArgumentException("Invalid email or password");
        }
    }

    public AuthResponse register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
        User savedUser = userRepository.save(user);
        return new AuthResponse("Registration successful", savedUser.getUserID());
    }

    public AuthResponse resetPassword(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User with this email not found");
        }
        User user = userOpt.get();
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        userRepository.save(user);
        return new AuthResponse("Password reset successful", user.getUserID());
    }
}
