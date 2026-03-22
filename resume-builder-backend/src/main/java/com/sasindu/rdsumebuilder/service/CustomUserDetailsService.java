package com.sasindu.rdsumebuilder.service;

import com.sasindu.rdsumebuilder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

        private final UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

                // Step 1: Query MongoDB for user by email
                // findByEmail returns Optional<User> (might be empty if user doesn't exist)
                com.sasindu.rdsumebuilder.document.User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "User not found with email: " + email));

                // Step 2: Build Spring Security's UserDetails object
                // We use Spring's User.builder() for convenience
                // This converts our MongoDB User document → Spring Security UserDetails
                return User.builder()
                                // Username (in our case, it's the email)
                                .username(user.getEmail())

                                // Password (already hashed with BCrypt in database)
                                // Spring Security will compare this with provided password
                                .password(user.getPassword())

                                // Authorities (roles/permissions)
                                // Spring Security requires "ROLE_" prefix
                                // We dynamically get the role from the User document (e.g., "USER" or "SUPER_ADMIN")
                                .authorities("ROLE_" + user.getRole())

                                // Account status flags
                                // accountExpired(false) - Account never expires
                                .accountExpired(false)

                                // accountLocked - Check if account is locked
                                // User gets locked after 5 failed login attempts
                                .accountLocked(user.getIsLocked())

                                // credentialsExpired(false) - Password never expires
                                .credentialsExpired(false)

                                // enabled - Check if account is active
                                // Account is enabled only if email is verified
                                .disabled(!user.getIsEmailVerified())

                                // Build the UserDetails object
                                .build();
        }

}
