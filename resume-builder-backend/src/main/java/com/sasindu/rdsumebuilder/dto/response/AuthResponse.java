package com.sasindu.rdsumebuilder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * AUTH RESPONSE DTO - Response after successful login/register
 * ============================================================================
 * This is what we send back to client after successful authentication
 *
 * CONTAINS:
 * - JWT access token (for API authentication)
 * - JWT refresh token (for getting new access token)
 * - User information (without sensitive data like password!)
 * ============================================================================
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder  // Enables: AuthResponse.builder().token("...").build()
public class AuthResponse {

    /**
     * JWT Access Token
     * Client stores this and sends in Authorization header for API requests
     * Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     * Valid for 24 hours (configurable in application.properties)
     */
    private String token;

    /**
     * JWT Refresh Token (Optional - for later implementation)
     * Used to get new access token without logging in again
     * Valid for 7 days (longer than access token)
     */
    private String refreshToken;

    /**
     * Token type (always "Bearer" for JWT)
     * Client uses this in Authorization header: "Bearer {token}"
     */
    @Builder.Default
    private String tokenType = "Bearer";

    /**
     * User information (safe to expose - no password!)
     * Embedded object containing user details
     */
    private UserInfo user;

    /**
     * ========================================================================
     * NESTED CLASS: User Information
     * ========================================================================
     * Contains only safe user data to send to client
     * NEVER include password or sensitive tokens!
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String profileImageUrl;
        private Boolean isPremium;
        private Boolean isEmailVerified;

        // ====================================================================
        // 🎯 YOUR TASK #4: Add a method to get full name
        // ====================================================================
        // INSTRUCTIONS:
        // 1. Add a method called getFullName() that returns String
        // 2. It should combine firstName + " " + lastName
        // 3. Handle null cases (return email if name is null)
        //
        // ADD THIS METHOD:
        // public String getFullName() {
        //     if (firstName == null && lastName == null) {
        //         return email;
        //     }
        //     return (firstName != null ? firstName : "") + " " +
        //            (lastName != null ? lastName : "");
        // }
        //
        // This teaches you: Adding helper methods to DTOs
        // ====================================================================
        public String getFullName() {
            if (firstName == null && lastName == null) {
                return email;
            }
            return (firstName != null ? firstName : "") + " " +
                   (lastName != null ? lastName : "");
        }
    }

}

/**
 * ============================================================================
 * EXAMPLE RESPONSE:
 * ============================================================================
 *
 * After successful login, API returns:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWE...",
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWE...",
 *   "tokenType": "Bearer",
 *   "user": {
 *     "id": "65a1b2c3d4e5f6789012345",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "john@example.com",
 *     "profileImageUrl": "https://cloudinary.com/image.jpg",
 *     "isPremium": false,
 *     "isEmailVerified": true
 *   }
 * }
 *
 * Client then:
 * 1. Stores token in localStorage or cookie
 * 2. Sends token with every API request:
 *    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 3. Displays user info (name, email, etc.)
 *
 * ============================================================================
 * SECURITY NOTE:
 * ============================================================================
 *
 * ✅ SAFE TO INCLUDE:
 * - id, firstName, lastName, email
 * - profileImageUrl, isPremium, isEmailVerified
 *
 * ❌ NEVER INCLUDE:
 * - password or password hash
 * - verificationToken, passwordResetToken
 * - Any sensitive internal data
 *
 * That's why we use DTOs instead of returning User entity directly!
 * ============================================================================
 */

