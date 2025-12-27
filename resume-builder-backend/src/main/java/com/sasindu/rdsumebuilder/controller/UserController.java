package com.sasindu.rdsumebuilder.controller;

import com.sasindu.rdsumebuilder.document.User;
import com.sasindu.rdsumebuilder.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String firstName) {
        String email = userDetails.getUsername();
        User updatedUser = userService.updateUserProfile(email, firstName);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/account")
    public ResponseEntity<String> deleteAccount(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        userService.deleteUser(email);
        return ResponseEntity.ok("Account deleted successfully");
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userService.getUserByEmail(email);

        var stats = new java.util.HashMap<String, Object>();
        stats.put("email", user.getEmail());
        stats.put("firstName", user.getFirstName());
        stats.put("lastName", user.getLastName());
        stats.put("isPremium", user.getIsPremium());
        stats.put("isPremiumActive", user.isPremiumActive());
        stats.put("memberSince", user.getCreatedAt());
        stats.put("emailVerified", user.getIsEmailVerified());

        return ResponseEntity.ok(stats);
    }
}
