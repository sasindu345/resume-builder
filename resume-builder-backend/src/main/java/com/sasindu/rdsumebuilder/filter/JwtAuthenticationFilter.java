package com.sasindu.rdsumebuilder.filter;

import com.sasindu.rdsumebuilder.service.CustomUserDetailsService;
import com.sasindu.rdsumebuilder.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * ============================================================================
 * JWT AUTHENTICATION FILTER - Request Interceptor & Token Validator
 * ============================================================================
 * This filter is the GATEKEEPER for all incoming HTTP requests.
 *
 * WHAT IS A FILTER?
 * - A filter intercepts HTTP requests BEFORE they reach the controller
 * - Think of it as a security checkpoint at an airport
 * - Every request must pass through this filter first
 * - It checks if the user has a valid JWT token
 *
 * HOW IT WORKS - COMPLETE FLOW:
 *
 * 1. Client sends request:
 * GET /api/user/profile
 * Headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *
 * 2. Request hits Spring Security Filter Chain
 *
 * 3. THIS FILTER intercepts the request:
 * ↓
 * Extract "Authorization" header
 * ↓
 * Check if it starts with "Bearer "
 * ↓
 * Extract JWT token (remove "Bearer " prefix)
 * ↓
 * Extract email from token using JwtUtil
 * ↓
 * Load user from database using CustomUserDetailsService
 * ↓
 * Validate token using JwtUtil
 * ↓
 * If valid: Set user in SecurityContext (user is now authenticated!)
 * If invalid: Do nothing (request will be rejected by Spring Security)
 * ↓
 * Pass request to next filter in chain
 *
 * 4. If authenticated: Request reaches controller
 * If not: Spring Security returns 401 Unauthorized
 *
 * WHY EXTEND OncePerRequestFilter?
 * - Guarantees filter runs ONLY ONCE per request
 * - Prevents duplicate authentication checks
 * - Spring best practice for authentication filters
 *
 * WHEN IS THIS FILTER CALLED?
 * - Every HTTP request to the server
 * - Before SecurityConfig rules are checked
 * - Before controller methods are executed
 *
 * PUBLIC vs PROTECTED ENDPOINTS:
 * - Public (no token needed): /api/auth/login, /api/auth/register
 * - Protected (token required): /api/user/*, /api/resume/*
 * - This filter runs for ALL, but only validates token if present
 *
 * ============================================================================
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * JWT utility to validate tokens and extract user info
     * Injected via constructor (@RequiredArgsConstructor)
     */
    private final JwtUtil jwtUtil;

    /**
     * Service to load user details from database
     * Used to verify user still exists and is active
     */
    private final CustomUserDetailsService userDetailsService;

    /**
     * ========================================================================
     * MAIN FILTER METHOD - Runs for Every Request
     * ========================================================================
     * This method is called by Spring Security for EVERY incoming HTTP request.
     *
     * RESPONSIBILITIES:
     * 1. Extract JWT token from Authorization header
     * 2. Validate the token
     * 3. Load user from database
     * 4. Set authentication in SecurityContext
     * 5. Pass request to next filter
     *
     * PARAMETERS:
     * 
     * @param request     - The incoming HTTP request (contains headers, body, etc.)
     * @param response    - The HTTP response (to send back to client)
     * @param filterChain - The chain of filters to execute next
     *
     * @throws ServletException if servlet error occurs
     * @throws IOException      if I/O error occurs
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // ====================================================================
        // STEP 1: Extract Authorization Header
        // ====================================================================
        // Get the "Authorization" header from the request
        // Example: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        final String authHeader = request.getHeader("Authorization");

        // Variables to store extracted data
        final String jwt; // The actual JWT token
        final String userEmail; // Email extracted from JWT

        // ====================================================================
        // STEP 2: Check if Authorization Header is Valid
        // ====================================================================
        // If no Authorization header OR doesn't start with "Bearer "
        // → This is either a public endpoint or invalid request
        // → Skip JWT validation and pass to next filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Continue to next filter without authentication
            // Public endpoints like /api/auth/login will work fine
            filterChain.doFilter(request, response);
            return; // Stop processing this filter
        }

        // ====================================================================
        // STEP 3: Extract JWT Token
        // ====================================================================
        // Remove "Bearer " prefix to get the actual token
        // "Bearer eyJhbGci..." → "eyJhbGci..."
        // substring(7) skips the first 7 characters ("Bearer ")
        jwt = authHeader.substring(7);

        // ====================================================================
        // STEP 4: Extract Email from JWT Token
        // ====================================================================
        // Use JwtUtil to extract the "subject" (email) from token
        // The "subject" is the primary identifier we stored in the token
        userEmail = jwtUtil.extractUsername(jwt);

        // ====================================================================
        // STEP 5: Check if User is Already Authenticated
        // ====================================================================
        // SecurityContextHolder.getContext().getAuthentication()
        // → Returns current authentication object (null if not authenticated)
        //
        // Why check this?
        // - If user is already authenticated in this request, skip validation
        // - Prevents redundant database lookups
        // - Improves performance
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // User email found in token AND user not yet authenticated
            // → Proceed with authentication

            // ================================================================
            // STEP 6: Load User Details from Database
            // ================================================================
            // Load the full user object from MongoDB
            // This ensures:
            // 1. User still exists in database
            // 2. User account is not locked
            // 3. User email is verified
            // 4. User has correct roles/authorities
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // ================================================================
            // STEP 7: Validate JWT Token
            // ================================================================
            // Check if token is valid for this user
            // Validation includes:
            // 1. Token signature is correct (not tampered with)
            // 2. Token is not expired
            // 3. Token subject matches the loaded user
            if (jwtUtil.isTokenValid(jwt, userDetails)) {
                // Token is VALID! → Authenticate the user

                // ============================================================
                // STEP 8: Create Authentication Object
                // ============================================================
                // UsernamePasswordAuthenticationToken is Spring Security's way
                // of representing an authenticated user
                //
                // Constructor parameters:
                // 1. principal: The user (UserDetails object)
                // 2. credentials: Password (null because already authenticated)
                // 3. authorities: User's roles/permissions (from UserDetails)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, // Who is the user?
                        null, // No credentials needed (already validated)
                        userDetails.getAuthorities() // What can they do? (roles)
                );

                // ============================================================
                // STEP 9: Add Request Details to Authentication
                // ============================================================
                // Add additional info like IP address, session ID, etc.
                // This is useful for logging and security auditing
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                // ============================================================
                // STEP 10: Set Authentication in SecurityContext
                // ============================================================
                // This is the MOST IMPORTANT step!
                // By setting authentication in SecurityContext:
                // 1. Spring Security knows the user is authenticated
                // 2. Controllers can access the user via @AuthenticationPrincipal
                // 3. Security rules (@PreAuthorize) can check user roles
                // 4. User can access protected endpoints
                SecurityContextHolder.getContext().setAuthentication(authToken);

                // User is now AUTHENTICATED! ✅
                // The request will proceed to the controller
            }
            // If token is invalid, we do nothing
            // → User remains unauthenticated
            // → Spring Security will reject the request (401 Unauthorized)
        }

        // ====================================================================
        // STEP 11: Continue to Next Filter
        // ====================================================================
        // Pass the request to the next filter in the chain
        // If user is authenticated: Request reaches controller
        // If not authenticated: Spring Security rejects it
        filterChain.doFilter(request, response);
    }

    /**
     * ========================================================================
     * FILTER EXECUTION SUMMARY
     * ========================================================================
     *
     * SCENARIO 1: Valid JWT Token
     * -------------------------
     * Request: GET /api/user/profile
     * Header: Authorization: Bearer <valid-token>
     *
     * Flow:
     * 1. Extract token ✅
     * 2. Extract email from token ✅
     * 3. Load user from database ✅
     * 4. Validate token ✅
     * 5. Set authentication in SecurityContext ✅
     * 6. Request reaches controller ✅
     * 7. Controller returns user profile ✅
     *
     * Result: 200 OK with profile data
     *
     * -------------------------
     * SCENARIO 2: Invalid/Expired Token
     * -------------------------
     * Request: GET /api/user/profile
     * Header: Authorization: Bearer <invalid-token>
     *
     * Flow:
     * 1. Extract token ✅
     * 2. Extract email from token ✅
     * 3. Load user from database ✅
     * 4. Validate token ❌ (Invalid/Expired)
     * 5. Authentication NOT set
     * 6. Spring Security rejects request
     *
     * Result: 401 Unauthorized
     *
     * -------------------------
     * SCENARIO 3: No Token (Public Endpoint)
     * -------------------------
     * Request: POST /api/auth/login
     * Header: (no Authorization header)
     *
     * Flow:
     * 1. No Authorization header ✅
     * 2. Skip JWT validation ✅
     * 3. Continue to next filter ✅
     * 4. SecurityConfig allows public access ✅
     * 5. Request reaches controller ✅
     *
     * Result: Login processed normally
     *
     * -------------------------
     * SCENARIO 4: User Account Locked
     * -------------------------
     * Request: GET /api/user/profile
     * Header: Authorization: Bearer <valid-token>
     *
     * Flow:
     * 1. Extract token ✅
     * 2. Extract email from token ✅
     * 3. Load user from database ✅
     * 4. UserDetailsService finds user is locked ❌
     * 5. Exception thrown: User account is locked
     *
     * Result: 401 Unauthorized (Account locked)
     *
     * -------------------------
     * SCENARIO 5: User Email Not Verified
     * -------------------------
     * Request: GET /api/user/profile
     * Header: Authorization: Bearer <valid-token>
     *
     * Flow:
     * 1. Extract token ✅
     * 2. Extract email from token ✅
     * 3. Load user from database ✅
     * 4. UserDetailsService finds user disabled (email not verified) ❌
     * 5. Exception thrown: User account is disabled
     *
     * Result: 401 Unauthorized (Email not verified)
     *
     * ========================================================================
     * INTEGRATION WITH OTHER COMPONENTS
     * ========================================================================
     *
     * This filter connects with:
     *
     * 1. JwtUtil (Phase 7):
     * - extractUsername(jwt) → Get email from token
     * - isTokenValid(jwt, userDetails) → Validate token
     *
     * 2. CustomUserDetailsService (Phase 9):
     * - loadUserByUsername(email) → Load user from MongoDB
     *
     * 3. SecurityConfig (Phase 4):
     * - This filter is registered in the security filter chain
     * - Runs BEFORE Spring Security's authentication filters
     *
     * 4. Controllers (Phase 11+):
     * - Can access authenticated user via @AuthenticationPrincipal
     * - Can use @PreAuthorize to check roles
     *
     * EXAMPLE: Using authenticated user in controller
     * ```java
     * @GetMapping("/profile")
     * public ResponseEntity<User> getProfile(
     * 
     * @AuthenticationPrincipal UserDetails userDetails
     *                          ) {
     *                          // userDetails is automatically injected by Spring
     *                          Security
     *                          // because we set it in SecurityContext in this
     *                          filter!
     *                          String email = userDetails.getUsername();
     *                          return userService.getProfile(email);
     *                          }
     *                          ```
     *
     *                          ========================================================================
     *                          SECURITY CONSIDERATIONS
     *                          ========================================================================
     *
     *                          1. ALWAYS USE HTTPS IN PRODUCTION
     *                          - JWT tokens in headers are vulnerable over HTTP
     *                          - HTTPS encrypts the entire request (including
     *                          headers)
     *
     *                          2. SHORT TOKEN EXPIRATION
     *                          - Our tokens expire in 24 hours (configurable)
     *                          - Reduces risk if token is stolen
     *
     *                          3. NO SENSITIVE DATA IN JWT
     *                          - Don't store passwords in JWT
     *                          - Only store user ID/email and minimal info
     *
     *                          4. VALIDATE ON EVERY REQUEST
     *                          - This filter validates token on EVERY request
     *                          - Ensures user still exists and is active
     *
     *                          5. LOGOUT = DELETE TOKEN ON CLIENT
     *                          - Server doesn't track tokens (stateless)
     *                          - Client must delete token on logout
     *
     *                          ========================================================================
     *                          DEBUGGING TIPS
     *                          ========================================================================
     *
     *                          If authentication is not working:
     *
     *                          1. Check Authorization header format:
     *                          ✅ "Authorization: Bearer <token>"
     *                          ❌ "Authorization: <token>" (missing "Bearer ")
     *                          ❌ "Auth: Bearer <token>" (wrong header name)
     *
     *                          2. Check token expiration:
     *                          - Use jwt.io to decode and inspect token
     *                          - Check "exp" claim (expiration timestamp)
     *
     *                          3. Check user account status:
     *                          - Email verified? (isEmailVerified = true)
     *                          - Account locked? (isLocked = false)
     *                          - User exists in database?
     *
     *                          4. Check SecurityConfig:
     *                          - Is this filter registered?
     *                          - Is endpoint protected or public?
     *
     *                          5. Add logging (for development only):
     *                          ```java
     *                          System.out.println("JWT Token: " + jwt);
     *                          System.out.println("User Email: " + userEmail);
     *                          System.out.println("Is Valid: " +
     *                          jwtUtil.isTokenValid(jwt, userDetails));
     *                          ```
     *
     *                          ========================================================================
     */
}

/**
 * ============================================================================
 * KEY TAKEAWAYS
 * ============================================================================
 *
 * 1. This filter is the GATEKEEPER - it validates JWT tokens on every request
 *
 * 2. It extracts the JWT from the Authorization header (Bearer token)
 *
 * 3. It validates the token using JwtUtil
 *
 * 4. It loads the user from database using CustomUserDetailsService
 *
 * 5. It sets the user in SecurityContext (authenticates the user)
 *
 * 6. Once authenticated, controllers can access user info
 * via @AuthenticationPrincipal
 *
 * 7. This filter runs BEFORE SecurityConfig rules are applied
 *
 * 8. Public endpoints skip JWT validation (no Authorization header)
 *
 * 9. Invalid/expired tokens result in 401 Unauthorized
 *
 * 10. This is the BRIDGE between JWT tokens and Spring Security
 *
 * ============================================================================
 * NEXT PHASE: Phase 11 - Auth Controller
 * ============================================================================
 * Now that we have complete authentication infrastructure, we'll create:
 * - AuthController: REST endpoints for register, login, verify email, etc.
 * - This will expose our auth services as HTTP APIs
 * - Then we can test everything with Postman!
 * ============================================================================
 */
