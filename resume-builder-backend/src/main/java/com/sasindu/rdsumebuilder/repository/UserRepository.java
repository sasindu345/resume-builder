package com.sasindu.rdsumebuilder.repository;

import com.sasindu.rdsumebuilder.document.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User repository for database operations.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Find user by email address.
     *
     * @param email The email to search for
     * @return Optional containing User if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if user exists with given email.
     *
     * @param email The email to check
     * @return true if user exists
     */
    Boolean existsByEmail(String email);

    /**
     * Find user by verification token.
     *
     * @param verificationToken The verification token
     * @return Optional containing User if found
     */
    Optional<User> findByVerificationToken(String verificationToken);

    /**
     * Find user by password reset token.
     *
     * @param passwordResetToken The password reset token
     * @return Optional containing User if found
     */
    Optional<User> findByPasswordResetToken(String passwordResetToken);
}
