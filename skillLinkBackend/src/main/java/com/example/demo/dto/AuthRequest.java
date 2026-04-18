package com.example.demo.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class AuthRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Format must be a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
