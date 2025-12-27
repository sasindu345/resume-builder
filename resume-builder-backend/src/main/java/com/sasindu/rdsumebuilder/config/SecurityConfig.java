package com.sasindu.rdsumebuilder.config;

import com.sasindu.rdsumebuilder.filter.JwtAuthenticationFilter;
import com.sasindu.rdsumebuilder.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * ============================================================================
 * SECURITY CONFIGURATION - Complete Spring Security Setup
 * ============================================================================
 * This configuration class sets up Spring Security with JWT authentication
 *
 * WHAT'S CONFIGURED HERE:
 * 1. Password Encoder (BCrypt) - Hash passwords securely
 * 2. UserDetailsService - Load users from MongoDB
 * 3. Authentication Provider - Combine #1 and #2
 * 4. Authentication Manager - Coordinate authentication process
 * 5. JWT Filter - Validate JWT tokens on every request
 * 6. Security Filter Chain - Define which endpoints are public/protected
 *
 * HOW AUTHENTICATION WORKS:
 * User Login Request
 * → Authentication Manager
 * → Authentication Provider
 * → UserDetailsService (loads user from DB)
 * → Password Encoder (compares passwords)
 * → Success → Generate JWT
 *
 * Protected Request:
 * User Request with JWT
 * → JWT Filter (validates token)
 * → SecurityContext (sets authentication)
 * → Controller (processes request)
 *
 * ============================================================================
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /**
     * Inject CustomUserDetailsService to load users from MongoDB
     */
    private final CustomUserDetailsService userDetailsService;

    /**
     * Inject JWT Authentication Filter
     */
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174}")
    private String allowedOrigins;

    @Value("${app.cors.allowed-methods:*}")
    private String allowedMethods;

    @Value("${app.cors.allowed-headers:*}")
    private String allowedHeaders;

    @Value("${app.cors.allow-credentials:true}")
    private boolean allowCredentials;

    /**
     * ========================================================================
     * PASSWORD ENCODER BEAN - BCrypt Hashing
     * ========================================================================
     * WHAT IT DOES:
     * - Hashes passwords before storing in database
     * - Verifies passwords during login
     *
     * EXAMPLE:
     * Plain: "mypassword123"
     * Hash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
     *
     * SECURITY:
     * - Salt: Random data added to password (prevents rainbow table attacks)
     * - Strength: 10 rounds (higher = more secure but slower)
     * - Each password gets unique hash even if passwords are same!
     *
     * @return BCrypt password encoder with strength 10
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    /**
     * ========================================================================
     * AUTHENTICATION PROVIDER - Combines UserDetailsService + PasswordEncoder
     * ========================================================================
     * WHAT IT DOES:
     * This is the component that actually performs authentication!
     *
     * PROCESS:
     * 1. Receives login credentials (email + password)
     * 2. Calls UserDetailsService to load user from database
     * 3. Uses PasswordEncoder to compare passwords
     * 4. Returns Authentication object if successful
     * 5. Throws exception if authentication fails
     *
     * @return Configured authentication provider
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * ========================================================================
     * AUTHENTICATION MANAGER - Coordinates Authentication Process
     * ========================================================================
     * WHAT IT DOES:
     * - Entry point for authentication
     * - Delegates to AuthenticationProvider
     * - Used by AuthService to authenticate users
     *
     * @param config Spring's authentication configuration
     * @return Authentication manager
     * @throws Exception if configuration fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * ========================================================================
     * SECURITY FILTER CHAIN - Main Security Configuration
     * ========================================================================
     * This is the MOST IMPORTANT configuration!
     *
     * WHAT IT DOES:
     * 1. Defines which endpoints are public (no authentication)
     * 2. Defines which endpoints are protected (require JWT)
     * 3. Registers JWT filter in the filter chain
     * 4. Disables session management (stateless JWT)
     * 5. Configures CORS, CSRF, etc.
     *
     * PUBLIC ENDPOINTS (no JWT required):
     * - POST /api/auth/register
     * - POST /api/auth/login
     * - GET /api/auth/verify-email
     * - POST /api/auth/forgot-password
     * - POST /api/auth/reset-password
     *
     * PROTECTED ENDPOINTS (JWT required):
     * - /api/user/** (user profile, etc.)
     * - /api/resume/** (resume CRUD)
     * - /api/payment/** (premium features)
     *
     * @param http HttpSecurity configuration
     * @return Configured security filter chain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (not needed for stateless JWT authentication)
                .csrf(csrf -> csrf.disable())

                // Enable CORS for the frontend origin
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Configure endpoint authorization
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - anyone can access
                        .requestMatchers(
                                "/api/auth/**", // All auth endpoints
                                "/api/public/**", // Public resources
                                "/error" // Error page
                        ).permitAll()

                        // Allow CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // All other endpoints require authentication
                        .anyRequest().authenticated())

                // Session management - stateless (no sessions, only JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Set authentication provider
                .authenticationProvider(authenticationProvider())

                // Add JWT filter before UsernamePasswordAuthenticationFilter
                // This ensures JWT validation happens BEFORE other authentication
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS configuration to allow the frontend to call the API during development.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allowed origins (comma-separated)
        for (String origin : allowedOrigins.split(",")) {
            String o = origin.trim();
            if (!o.isEmpty())
                config.addAllowedOriginPattern(o);
        }

        // Allowed methods (comma-separated or wildcard)
        if ("*".equals(allowedMethods)) {
            config.addAllowedMethod("*");
        } else {
            for (String m : allowedMethods.split(",")) {
                String mm = m.trim();
                if (!mm.isEmpty())
                    config.addAllowedMethod(mm);
            }
        }

        // Allowed headers (comma-separated or wildcard)
        if ("*".equals(allowedHeaders)) {
            config.addAllowedHeader("*");
        } else {
            for (String h : allowedHeaders.split(",")) {
                String hh = h.trim();
                if (!hh.isEmpty())
                    config.addAllowedHeader(hh);
            }
        }

        config.setAllowCredentials(allowCredentials);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
