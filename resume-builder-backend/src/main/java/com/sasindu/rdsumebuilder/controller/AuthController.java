package com.sasindu.rdsumebuilder.controller;

import com.sasindu.rdsumebuilder.dto.request.LoginRequest;
import com.sasindu.rdsumebuilder.dto.request.RegisterRequest;
import com.sasindu.rdsumebuilder.dto.response.AuthResponse;
import com.sasindu.rdsumebuilder.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(
                "Registration successful. Please check your email to verify your account.");
    }

    /**
     * Login endpoint - Authenticate user and generate JWT token.
     *
     * @param request LoginRequest containing email and password
     * @return ResponseEntity with AuthResponse (token, email, message)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Verify email with token
     *
     * @param token Verification token from email link
     * @return ResponseEntity with success message
     */
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(
                "Email verified successfully. You can now login.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok("If the email exists, a password reset link has been sent.");
    }

    /**
     * Reset password with token
     *
     * @param token       Password reset token
     * @param newPassword New password to set
     * @return ResponseEntity with success message
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(
                "Password reset successful. You can now login with your new password.");
    }

    /**
     * Health check endpoint
     *
     * @return Status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running!");
    }
}
