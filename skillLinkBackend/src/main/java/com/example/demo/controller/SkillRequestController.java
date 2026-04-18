package com.example.demo.controller;

import com.example.demo.model.SkillRequest;
import com.example.demo.service.SkillRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class SkillRequestController {

    @Autowired
    private SkillRequestService skillRequestService;

    @PostMapping("/send")
    public ResponseEntity<SkillRequest> sendRequest(
            @RequestParam Integer senderId,
            @RequestParam Integer receiverId,
            @RequestParam Integer skillId,
            @RequestBody SkillRequest requestData) {
        return new ResponseEntity<>(skillRequestService.sendRequest(senderId, receiverId, skillId, requestData), HttpStatus.CREATED);
    }

    @GetMapping("/received/{userId}")
    public ResponseEntity<List<SkillRequest>> getReceivedRequests(@PathVariable Integer userId) {
        return ResponseEntity.ok(skillRequestService.getReceivedRequests(userId));
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<SkillRequest> updateRequestStatus(
            @PathVariable Integer requestId,
            @RequestParam String status) {
        return ResponseEntity.ok(skillRequestService.updateRequestStatus(requestId, status));
    }
}
