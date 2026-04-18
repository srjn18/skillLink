package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Skill;
import com.example.demo.model.User;
import com.example.demo.model.UserSkill;
import com.example.demo.repository.SkillRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Skill> searchSkills(String query) {
        return skillRepository.findBySkillNameContainingIgnoreCase(query);
    }

    public Skill addSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public UserSkill addUserSkill(Integer userId, Integer skillId, UserSkill userSkillData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        userSkillData.setUser(user);
        userSkillData.setSkill(skill);

        return userSkillRepository.save(userSkillData);
    }

    public List<UserSkill> getUserSkills(Integer userId) {
        return userSkillRepository.findByUserUserID(userId);
    }
}
