package com.sasindu.rdsumebuilder.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================================
 * LOGIN REQUEST DTO - Data Transfer Object for user login
 * ============================================================================
 * This class represents the data sent from client when user tries to log in
 *
 * WHY DTO?
 * - Separates API layer from database layer (User entity)
 * - Validates incoming data automatically
 * - Only contains fields needed for login (email & password)
 * ============================================================================
 */
@Data                    // Lombok: generates getters, setters, toString, equals, hashCode
@NoArgsConstructor       // Lombok: creates empty constructor new LoginRequest()
@AllArgsConstructor      // Lombok: creates constructor with all fields
public class LoginRequest {

    /**
     * User's email address
     *
     * VALIDATION:
     * @NotBlank - Cannot be null, empty, or just whitespace
     * @Email - Must be valid email format (example@domain.com)
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    /**
     * User's password
     *
     * VALIDATION:
     * @NotBlank - Cannot be null or empty
     * @Size - Must be at least 8 characters long
     *
     * NOTE: This is plain text password from client
     * We'll hash it with BCrypt before checking database
     */
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    // ========================================================================
    // 🎯 YOUR TASK #1: Add a "rememberMe" field
    // ========================================================================
    // INSTRUCTIONS:
    // 1. Add a new field below called "rememberMe" (Boolean type)
    // 2. This field is OPTIONAL (no validation needed)
    // 3. It will be used to create longer-lasting JWT tokens
    //
    // ADD THIS CODE:
    // private Boolean rememberMe;
    //
    // That's it! Just one line. This teaches you how to add optional fields.
    // ========================================================================

    private Boolean rememberMe;
}

/**
 * ============================================================================
 * HOW THIS WORKS:
 * ============================================================================
 *
 * 1. Client sends JSON:
 *    {
 *      "email": "john@example.com",
 *      "password": "mypassword123"
 *    }
 *
 * 2. Spring Boot automatically converts JSON to LoginRequest object
 *
 * 3. @Valid annotation in controller triggers validation:
 *    - Checks if email is not blank
 *    - Checks if email format is valid
 *    - Checks if password is not blank
 *    - Checks if password is at least 8 characters
 *
 * 4. If validation fails, Spring returns 400 Bad Request with error messages
 *
 * 5. If validation passes, controller receives validated LoginRequest object
 *
 * ============================================================================
 * KEY CONCEPTS:
 * ============================================================================
 *
 * @Data - Lombok annotation that generates:
 *   - getEmail() and setEmail()
 *   - getPassword() and setPassword()
 *   - toString() method
 *   - equals() and hashCode() methods
 *
 * @NotBlank - Bean Validation annotation
 *   - Value cannot be null
 *   - Value cannot be empty string ""
 *   - Value cannot be just whitespace "   "
 *
 * @Email - Bean Validation annotation
 *   - Checks if string matches email pattern
 *   - Example valid: john@example.com
 *   - Example invalid: not-an-email
 *
 * @Size(min, max) - Bean Validation annotation
 *   - Checks string length
 *   - min = minimum characters required
 *   - max = maximum characters allowed (optional)
 *
 * ============================================================================
 */

