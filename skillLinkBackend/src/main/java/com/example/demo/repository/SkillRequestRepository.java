package com.example.demo.repository;

import com.example.demo.model.SkillRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRequestRepository extends JpaRepository<SkillRequest, Integer> {
    List<SkillRequest> findBySenderUserID(Integer senderId);
    List<SkillRequest> findByReceiverUserID(Integer receiverId);
}
