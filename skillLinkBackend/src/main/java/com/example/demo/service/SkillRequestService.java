package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Skill;
import com.example.demo.model.SkillRequest;
import com.example.demo.model.User;
import com.example.demo.repository.SkillRepository;
import com.example.demo.repository.SkillRequestRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillRequestService {

    @Autowired
    private SkillRequestRepository skillRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SkillRepository skillRepository;

    public SkillRequest sendRequest(Integer senderId, Integer receiverId, Integer skillId, SkillRequest requestData) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        requestData.setSender(sender);
        requestData.setReceiver(receiver);
        requestData.setSkill(skill);
        requestData.setStatus("PENDING");

        return skillRequestRepository.save(requestData);
    }

    public List<SkillRequest> getReceivedRequests(Integer userId) {
        return skillRequestRepository.findByReceiverUserID(userId);
    }

    public SkillRequest updateRequestStatus(Integer requestId, String status) {
        SkillRequest request = skillRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill request not found"));
        
        request.setStatus(status);
        return skillRequestRepository.save(request);
    }
}
