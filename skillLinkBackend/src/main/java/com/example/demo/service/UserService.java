package com.example.demo.service;

import com.example.demo.dto.ProfileUpdateRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.User;
import com.example.demo.model.UserProfile;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    public List<User> searchUsers(String query, String skill) {
        if (skill != null && !skill.trim().isEmpty()) {
            String[] skillTokens = skill.split("(?i)\\s+AND\\s+");
            List<User> matchedUsers = null;
            for (String token : skillTokens) {
                String s = token.trim();
                if(s.isEmpty()) continue;
                List<User> usersForSkill = userRepository.findUsersBySkillNamePart(s);
                if (matchedUsers == null) {
                    matchedUsers = new java.util.ArrayList<>(usersForSkill);
                } else {
                    matchedUsers.retainAll(usersForSkill);
                }
            }
            return matchedUsers == null ? new java.util.ArrayList<>() : matchedUsers;
        } else if (query != null && !query.trim().isEmpty()) {
            return userRepository.findByNameContainingIgnoreCase(query);
        }
        return new java.util.ArrayList<>();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserProfile getUserProfile(Integer userId) {
        return userProfileRepository.findByUserUserID(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Profile not found"));
    }

    public UserProfile updateProfile(Integer userId, ProfileUpdateRequest profileData) {
        User user = getUserById(userId);

        if (profileData.getBranch() != null) user.setBranch(profileData.getBranch());
        if (profileData.getSemester() != null) user.setSemester(profileData.getSemester());
        userRepository.save(user);

        UserProfile profile = userProfileRepository.findByUserUserID(userId).orElse(new UserProfile());
        profile.setUser(user);
        profile.setBio(profileData.getBio());
        profile.setGithubLink(profileData.getGithubLink());
        profile.setLinkedinLink(profileData.getLinkedinLink());
        if (profileData.getPhone() != null) profile.setPhone(profileData.getPhone());
        profile.setProfileImage(profileData.getProfileImage());

        return userProfileRepository.save(profile);
    }
}
