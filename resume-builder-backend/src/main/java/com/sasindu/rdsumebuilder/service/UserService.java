package com.sasindu.rdsumebuilder.service;

import com.sasindu.rdsumebuilder.document.User;
import com.sasindu.rdsumebuilder.dto.response.AuthResponse;
import com.sasindu.rdsumebuilder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * User service for business logic operations.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmailOptional(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User updateUserProfile(String userId, String firstName, String lastName, String phone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (firstName != null && !firstName.isBlank()) {
            user.setFirstName(firstName);
        }

        if (lastName != null && !lastName.isBlank()) {
            user.setLastName(lastName);
        }

        if (phone != null && !phone.isBlank()) {
            user.setPhone(phone);
        }

        return userRepository.save(user);
    }

    public User updateProfileImage(String userId, String imageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfileImageUrl(imageUrl);
        return userRepository.save(user);
    }

    public User updateUserEmail(String userId, String newEmail) {
        if (existsByEmail(newEmail)) {
            throw new RuntimeException("Email already in use: " + newEmail);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(newEmail);
        user.setIsEmailVerified(false);

        return userRepository.save(user);
    }

    public User updateUserProfile(String email, String firstName) {
        User user = getUserByEmail(email);

        if (firstName != null && !firstName.isBlank()) {
            user.setFirstName(firstName);
        }

        return userRepository.save(user);
    }

    public void deleteUser(String email) {
        User user = getUserByEmail(email);
        userRepository.delete(user);
    }

    public AuthResponse.UserInfo convertToUserInfo(User user) {
        return AuthResponse.UserInfo.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .isPremium(user.getIsPremium())
                .isEmailVerified(user.getIsEmailVerified())
                .build();
    }
}
