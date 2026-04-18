package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(indexes = { @Index(name="idx_skill_name", columnList="skillName") })
@Data
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer skillId;

    private String skillName;
    private String category;

}
