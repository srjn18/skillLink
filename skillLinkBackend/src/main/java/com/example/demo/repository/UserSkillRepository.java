package com.example.demo.repository;

import com.example.demo.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Integer> {
    List<UserSkill> findByUserUserID(Integer userId);
    List<UserSkill> findBySkillSkillId(Integer skillId);
}
