package com.example.demo.controller;

import com.example.demo.model.Skill;
import com.example.demo.model.UserSkill;
import com.example.demo.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @GetMapping("/search")
    public ResponseEntity<List<Skill>> searchSkills(@RequestParam String query) {
        return ResponseEntity.ok(skillService.searchSkills(query));
    }

    @PostMapping("/add")
    public ResponseEntity<Skill> addSkill(@RequestBody Skill skill) {
        return new ResponseEntity<>(skillService.addSkill(skill), HttpStatus.CREATED);
    }

    @PostMapping("/user/{userId}/add/{skillId}")
    public ResponseEntity<UserSkill> addUserSkill(
            @PathVariable Integer userId,
            @PathVariable Integer skillId,
            @RequestBody UserSkill userSkillData) {
        return new ResponseEntity<>(skillService.addUserSkill(userId, skillId, userSkillData), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserSkill>> getUserSkills(@PathVariable Integer userId) {
        return ResponseEntity.ok(skillService.getUserSkills(userId));
    }
}
