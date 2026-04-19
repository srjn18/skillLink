package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContainingIgnoreCase(String name);

    @Query("SELECT DISTINCT u FROM UserSkill us JOIN us.user u JOIN us.skill s WHERE LOWER(s.skillName) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<User> findUsersBySkillNamePart(@Param("skill") String skill);
}
