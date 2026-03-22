package com.sasindu.rdsumebuilder.controller;

import com.sasindu.rdsumebuilder.document.User;
import com.sasindu.rdsumebuilder.repository.ResumeRepository;
import com.sasindu.rdsumebuilder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalResumes", resumeRepository.count());
        
        // Count premium users
        long premiumUsers = userRepository.findAll().stream()
                .filter(u -> Boolean.TRUE.equals(u.getIsPremium()))
                .count();
        stats.put("totalPremiumUsers", premiumUsers);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> safeUsers = userRepository.findAll().stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("email", user.getEmail());
                    map.put("firstName", user.getFirstName());
                    map.put("lastName", user.getLastName());
                    map.put("role", user.getRole());
                    map.put("isPremium", user.getIsPremium());
                    map.put("isActive", user.getIsActive());
                    map.put("isLocked", user.getIsLocked());
                    map.put("createdAt", user.getCreatedAt());
                    map.put("failedLoginAttempts", user.getFailedLoginAttempts());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(safeUsers);
    }

    @PostMapping("/users/{userId}/toggle-lock")
    public ResponseEntity<Map<String, String>> toggleUserLock(@PathVariable String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Prevent locking another SUPER_ADMIN
        if ("SUPER_ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cannot lock a SUPER_ADMIN account"));
        }

        user.setIsLocked(!user.getIsLocked());
        if (!user.getIsLocked()) {
            user.setFailedLoginAttempts(0); // Reset attempts on unlock
        }
        
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User lock status updated to " + user.getIsLocked()));
    }
}
