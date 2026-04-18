package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class UserSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userSkillId;

    private String proficiency;
    private Integer experience;

    @ManyToOne
    @JoinColumn(name="userID")
    private User user;

    @ManyToOne
    @JoinColumn(name="skillID")
    private Skill skill;
}
