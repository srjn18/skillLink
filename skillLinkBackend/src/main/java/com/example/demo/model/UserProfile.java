package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="user_profile")
@Data
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer profileId;

    private String linkedinLink;
    private String githubLink;
    private String bio;
    private String phone;
    private String profileImage;

    @OneToOne
    @JoinColumn(name="userID")
    @JsonIgnore
    private User user;
}
