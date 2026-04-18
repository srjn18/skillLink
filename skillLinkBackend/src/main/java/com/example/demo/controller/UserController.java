package com.example.demo.controller;

import com.example.demo.dto.ProfileUpdateRequest;
import com.example.demo.model.User;
import com.example.demo.model.UserProfile;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam(required = false) String query, @RequestParam(required = false) String skill) {
        List<User> users = userService.searchUsers(query, skill);
        if (users.isEmpty()) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                    .body(java.util.Collections.singletonMap("message", skill != null && !skill.trim().isEmpty() ? "No users found with this skill." : "User not found"));
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable Integer id, @RequestBody ProfileUpdateRequest profileData) {
        return ResponseEntity.ok(userService.updateProfile(id, profileData));
    }
}
