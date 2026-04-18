package com.example.demo.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String bio;
    private String profileImage;
    private String linkedinLink;
    private String githubLink;
    private String branch;
    private String semester;
    private String phone;
}
