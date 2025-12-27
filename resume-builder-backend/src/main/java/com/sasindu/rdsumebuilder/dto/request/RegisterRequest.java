package com.sasindu.rdsumebuilder.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * REGISTER REQUEST DTO - Data for new user registration
 * ============================================================================
 * Contains all information needed when a new user creates an account
 * ============================================================================
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    /**
     * User's first name
     * Must be between 2-50 characters
     */
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    /**
     * User's last name
     * Must be between 2-50 characters
     */
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    /**
     * User's email address (will be used for login)
     * Must be unique in database (we'll check in service layer)
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    // ========================================================================
    // 🎯 YOUR TASK #2: Add password validation
    // ========================================================================
    // INSTRUCTIONS:
    // 1. Below this comment, add a password field (String type)
    // 2. Add validation: @NotBlank with message "Password is required"
    // 3. Add validation: @Size(min = 8, max = 100) with appropriate message
    // 4. Add JavaDoc comment explaining it's the password field
    //
    // EXAMPLE FORMAT:
    // /**
    //  * User's password
    //  * Will be hashed with BCrypt before storing in database
    //  */
    // @NotBlank(message = "Password is required")
    // @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    // private String password;
    //
    // This teaches you: How to add validated fields
    // ========================================================================
     @NotBlank(message = "Password is required")
     @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
     private String password;

    // ========================================================================
    // 🎯 YOUR TASK #3: Add optional phone field
    // ========================================================================
    // INSTRUCTIONS:
    // 1. Add a field called "phone" (String type)
    // 2. This field is OPTIONAL (no @NotBlank)
    // 3. But if provided, should be between 10-15 characters
    // 4. Use @Size(min = 10, max = 15) without the "message" parameter
    //
    // ADD THIS:
    // private String phone;  // Optional field - no validation
    //
    // OR with validation if provided:
    // @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 digits")
    // private String phone;
    //
    // This teaches you: Difference between required and optional fields
    // ========================================================================
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 digits")
    private String phone;
}



/**
 * ============================================================================
 * EXAMPLE USAGE:
 * ============================================================================
 *
 * Client sends this JSON to POST /api/auth/register:
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "password": "securepass123",
 *   "phone": "1234567890"
 * }
 *
 * Spring Boot converts to RegisterRequest object and validates:
 * ✅ firstName: not blank, 2-50 chars → "John" (valid)
 * ✅ lastName: not blank, 2-50 chars → "Doe" (valid)
 * ✅ email: valid format → "john@example.com" (valid)
 * ✅ password: not blank, 8+ chars → "securepass123" (valid)
 * ✅ phone: optional, if present 10-15 chars → "1234567890" (valid)
 *
 * If validation fails:
 * ❌ Returns 400 Bad Request with error messages
 *
 * If validation passes:
 * ✅ Controller receives validated RegisterRequest
 * ✅ Service creates User entity
 * ✅ Password gets hashed with BCrypt
 * ✅ User saved to MongoDB
 * ✅ Verification email sent
 *
 * ============================================================================
 */

