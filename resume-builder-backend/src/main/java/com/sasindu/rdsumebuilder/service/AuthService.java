package com.sasindu.rdsumebuilder.service;

import com.sasindu.rdsumebuilder.document.User;
import com.sasindu.rdsumebuilder.dto.request.LoginRequest;
import com.sasindu.rdsumebuilder.dto.request.RegisterRequest;
import com.sasindu.rdsumebuilder.dto.response.AuthResponse;
import com.sasindu.rdsumebuilder.repository.UserRepository;
import com.sasindu.rdsumebuilder.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for authentication and authorization operations.
 * Handles registration, login, email verification, and password reset.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    /**
     * Register a new user account.
     *
     * @param request RegisterRequest DTO with user info
     * @return AuthResponse with success message (no token until email verified)
     * @throws RuntimeException if email already exists
     */
    public AuthResponse register(RegisterRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        String verificationToken = UUID.randomUUID().toString();
        LocalDateTime tokenExpiry = LocalDateTime.now().plusHours(24);

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(hashedPassword)
                .phone(request.getPhone())
                .verificationToken(verificationToken)
                .verificationTokenExpiry(tokenExpiry)
                .isEmailVerified(false)
                .isPremium(false)
                .isActive(true)
                .isLocked(false)
                .failedLoginAttempts(0)
                .build();

        User savedUser = userRepository.save(user);

        emailService.sendVerificationEmail(
                savedUser.getEmail(),
                savedUser.getFirstName(),
                verificationToken);

        return AuthResponse.builder()
                .token(null)
                .tokenType("Bearer")
                .user(userService.convertToUserInfo(savedUser))
                .build();
    }

    /**
     * Authenticate user and generate JWT token.
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (user.getIsLocked()) {
            throw new RuntimeException("Account is locked due to multiple failed login attempts");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            handleFailedLogin(user);
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getIsEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        if (user.getFailedLoginAttempts() > 0) {
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
        }

        String jwtToken = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .tokenType("Bearer")
                .user(userService.convertToUserInfo(user))
                .build();
    }

    /**
     * Handle failed login attempt - increments counter and locks after 5 failures.
     */
    private void handleFailedLogin(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);

        if (attempts >= 5) {
            user.setIsLocked(true);
            System.out.println("Account locked for: " + user.getEmail());
        }

        userRepository.save(user);
    }

    /**
     * Verify user's email using token.
     *
     * @param token Verification token from email link
     * @return Success message
     * @throws RuntimeException if token invalid or expired
     */
    public String verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (!user.isVerificationTokenValid()) {
            throw new RuntimeException("Verification token has expired. Please request a new one.");
        }

        user.setIsEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        emailService.sendWelcomeEmail(
                user.getEmail(),
                user.getFirstName());

        return "Email verified successfully! You can now login.";
    }

    /**
     * Initiate password reset process
     *
     * @param email User's email address
     * @return Success message
     */
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            String resetToken = UUID.randomUUID().toString();
            LocalDateTime tokenExpiry = LocalDateTime.now().plusHours(1);

            user.setPasswordResetToken(resetToken);
            user.setPasswordResetTokenExpiry(tokenExpiry);
            userRepository.save(user);

            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    user.getFirstName(),
                    resetToken);
        }

        return "If your email exists in our system, you will receive a password reset link.";
    }

    /**
     * Reset password using token
     *
     * @param token       Password reset token
     * @param newPassword New password to set
     * @return Success message
     * @throws RuntimeException if token invalid or expired
     */
    public String resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid password reset token"));

        if (!user.isPasswordResetTokenValid()) {
            throw new RuntimeException("Password reset token has expired. Please request a new one.");
        }

        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);

        if (user.getIsLocked()) {
            user.setIsLocked(false);
            user.setFailedLoginAttempts(0);
        }

        userRepository.save(user);

        return "Password reset successfully! You can now login with your new password.";
    }

    /**
     * Resend email verification link
     *
     * @param email User's email address
     * @return Success message
     * @throws RuntimeException if user not found or already verified
     */
    public String resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getIsEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        String verificationToken = UUID.randomUUID().toString();
        LocalDateTime tokenExpiry = LocalDateTime.now().plusHours(24);

        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(tokenExpiry);
        userRepository.save(user);

        System.out.println("New verification link: http://localhost:3000/verify-email?token=" + verificationToken);

        return "Verification email sent! Please check your inbox.";
    }
}
