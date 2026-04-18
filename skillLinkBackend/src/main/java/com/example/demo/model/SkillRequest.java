package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class SkillRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestId;

    @CreationTimestamp
    private Timestamp requestDate;
    private String message;
    private String status;

    @ManyToOne
    @JoinColumn(name="skillID")
    private Skill skill;

    @ManyToOne
    @JoinColumn(name = "senderID")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiverID")
    private User receiver;
}
