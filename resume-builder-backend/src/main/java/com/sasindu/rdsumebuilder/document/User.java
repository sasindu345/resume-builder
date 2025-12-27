package com.sasindu.rdsumebuilder.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * User entity representing application users.
 * Stored in MongoDB "users" collection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String firstName;
    private String lastName;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String phone;
    private String profileImageUrl;

    @Builder.Default
    private String subscriptionPlan = "basic";

    @Builder.Default
    private Boolean isPremium = false;

    private LocalDateTime premiumExpiryDate;

    @Builder.Default
    private Boolean isEmailVerified = false;

    private String verificationToken;
    private LocalDateTime verificationTokenExpiry;

    private String passwordResetToken;
    private LocalDateTime passwordResetTokenExpiry;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isLocked = false;

    @Builder.Default
    private Integer failedLoginAttempts = 0;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public String getFullName() {
        if (firstName == null && lastName == null) {
            return email;
        }
        return (firstName != null ? firstName : "") + " " +
                (lastName != null ? lastName : "");
    }

    public boolean isPremiumActive() {
        if (!isPremium || premiumExpiryDate == null) {
            return false;
        }
        return LocalDateTime.now().isBefore(premiumExpiryDate);
    }

    public boolean isVerificationTokenValid() {
        if (verificationToken == null || verificationTokenExpiry == null) {
            return false;
        }
        return LocalDateTime.now().isBefore(verificationTokenExpiry);
    }

    public boolean isPasswordResetTokenValid() {
        if (passwordResetToken == null || passwordResetTokenExpiry == null) {
            return false;
        }
        return LocalDateTime.now().isBefore(passwordResetTokenExpiry);
    }
}
