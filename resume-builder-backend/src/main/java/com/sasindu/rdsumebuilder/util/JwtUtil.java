package com.sasindu.rdsumebuilder.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT utility for token generation, validation and extraction.
 * Handles all JWT operations for authentication.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

    /**
     * Generate JWT token for a user
     *
     * @param email User's email (used as unique identifier)
     * @return JWT token string
     */
    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, email);
    }

    /**
     * Create JWT token with claims and subject
     *
     * @param claims  Additional data to include in token
     * @param subject User identifier (email)
     * @return Complete JWT token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validate if token is valid and not expired
     *
     * @param token JWT token from Authorization header
     * @param email Email to verify against token
     * @return true if valid, false otherwise
     */
    public Boolean validateToken(String token, String email) {
        try {
            final String tokenEmail = extractEmail(token);
            return (tokenEmail.equals(email) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Validate token against UserDetails
     * Used by JwtAuthenticationFilter for Spring Security integration
     *
     * @param token       JWT token
     * @param userDetails Spring Security UserDetails object
     * @return true if token is valid and matches user
     */
    public Boolean isTokenValid(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if token is expired
     *
     * @param token JWT token
     * @return true if expired, false if still valid
     */
    private Boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration.before(new Date());
    }

    /**
     * Extract email (subject) from token
     *
     * @param token JWT token
     * @return User's email
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract username (email) from token
     * Alias for extractEmail() - maintains Spring Security naming convention
     *
     * @param token JWT token
     * @return User's email (username)
     */
    public String extractUsername(String token) {
        return extractEmail(token);
    }

    /**
     * Extract expiration date from token
     *
     * @param token JWT token
     * @return Expiration date
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract issued at date from token
     *
     * @param token JWT token
     * @return Issued at date
     */
    public Date extractIssuedAt(String token) {
        return extractClaim(token, Claims::getIssuedAt);
    }

    /**
     * Generic method to extract any claim from token
     *
     * @param token          JWT token
     * @param claimsResolver Function to extract specific claim
     * @param <T>            Type of claim to extract
     * @return Extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from token
     *
     * @param token JWT token
     * @return Claims object containing all token data
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Get signing key for JWT operations
     *
     * @return SecretKey object for HMAC-SHA signing
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ========================================================================
    // 🎯 YOUR TASK #7: Add method to get token expiration time in hours
    // ========================================================================
    // INSTRUCTIONS:
    // 1. Add a public method called getExpirationTimeInHours() that returns long
    // 2. It should convert EXPIRATION_TIME (milliseconds) to hours
    // 3. Formula: hours = milliseconds / 1000 / 60 / 60
    // 4. Add JavaDoc comment explaining the conversion
    //
    // ADD THIS METHOD BELOW:
    // /**
    // * Get token expiration time in hours
    // * Converts milliseconds to hours for readability
    // *
    // * @return Expiration time in hours
    // */
    // public long getExpirationTimeInHours() {
    // return EXPIRATION_TIME / 1000 / 60 / 60;
    // }
    //
    // This teaches you: Working with time conversions and public utility methods
    // ========================================================================
    public long getExpirationTimeInHours() {
        return EXPIRATION_TIME / 1000 / 60 / 60;
    }
}

/**
 * ============================================================================
 * EMAIL SERVICE EXPLANATION - HOW IT WORKS (100% FREE!)
 * ============================================================================
 *
 * We'll use Gmail SMTP (Simple Mail Transfer Protocol) - It's COMPLETELY FREE!
 *
 * WHAT IS SMTP?
 * - SMTP = Simple Mail Transfer Protocol
 * - It's the standard protocol for sending emails
 * - Gmail provides a free SMTP server anyone can use
 * - You can send up to 500 emails per day for FREE
 * - Perfect for our resume builder app!
 *
 * HOW DOES IT WORK?
 * 1. Our Spring Boot app acts as an email client
 * 2. We connect to Gmail's SMTP server (smtp.gmail.com)
 * 3. We authenticate with our Gmail credentials
 * 4. We compose the email (HTML/text)
 * 5. Gmail's server sends the email to the recipient
 * 6. Recipient receives email in their inbox
 *
 * SETUP STEPS (Next Phase):
 * 1. Use any Gmail account (e.g., yourapp@gmail.com)
 * 2. Enable "2-Step Verification" in Google Account
 * 3. Generate "App Password" (special 16-character password)
 * 4. Add credentials to application.properties
 * 5. Configure JavaMailSender in Spring
 * 6. Send emails using simple Java code!
 *
 * GMAIL SMTP SETTINGS (FREE):
 * - Host: smtp.gmail.com
 * - Port: 587 (TLS - recommended)
 * - Port: 465 (SSL - alternative)
 * - Security: TLS/STARTTLS
 * - Username: your-email@gmail.com
 * - Password: your-16-char-app-password
 * - Daily Limit: 500 emails (more than enough!)
 *
 * WHAT WE'LL SEND:
 * ✉️ Welcome Email - When user registers
 * ✉️ Email Verification - Link to confirm email
 * ✉️ Password Reset - Secure reset link
 * ✉️ Account Notifications - Important updates
 * ✉️ Resume Share - Send resume to employers
 *
 * EMAIL VERIFICATION FLOW:
 * 1. User registers: POST /api/auth/register
 * 2. We save user with isEmailVerified = false
 * 3. We generate verification token (JWT or random string)
 * 4. We send email with link: http://localhost:3000/verify?token=abc123
 * 5. User clicks link in email
 * 6. Frontend calls: GET /api/auth/verify-email?token=abc123
 * 7. Backend validates token
 * 8. We update user: isEmailVerified = true
 * 9. User can now access all features!
 *
 * EXAMPLE EMAIL TEMPLATE (HTML):
 * ```html
 * <!DOCTYPE html>
 * <html>
 * <body style="font-family: Arial, sans-serif;">
 * <h2>Welcome to Resume Builder! 🎉</h2>
 * <p>
 * Hi {{ user.name }},
 * </p>
 * <p>
 * Thank you for registering. Click the button below to verify your email:
 * </p>
 * <a href="{{ verificationLink }}" style="background: #4CAF50; color: white;
 * padding: 10px 20px;">
 * Verify Email
 * </a>
 * <p>
 * Or copy this link: {{ verificationLink }}
 * </p>
 * <p>
 * This link expires in 24 hours.
 * </p>
 * </body>
 * </html>
 * ```
 *
 * SECURITY FEATURES:
 * ✅ Token expires after 24 hours
 * ✅ One-time use only (deleted after verification)
 * ✅ Sent over HTTPS only
 * ✅ App password (not real Gmail password)
 * ✅ Rate limiting (prevent spam)
 *
 * FREE ALTERNATIVES (if you don't want Gmail):
 * 1. SendGrid - 100 emails/day free
 * 2. Mailgun - 100 emails/day free
 * 3. Amazon SES - 62,000 emails/month free (first 12 months)
 * 4. Mailtrap - For testing only (emails don't actually send)
 *
 * WHY GMAIL IS BEST FOR LEARNING:
 * ✅ Free forever (no credit card needed)
 * ✅ Easy setup (5 minutes)
 * ✅ Reliable (99.9% uptime)
 * ✅ No verification needed
 * ✅ Real emails actually get sent
 * ✅ 500/day is plenty for development
 * ✅ Works immediately
 *
 * PRODUCTION RECOMMENDATIONS:
 * For real apps with many users:
 * - SendGrid (99,000 emails/month for $20)
 * - Amazon SES (Very cheap - $0.10 per 1,000 emails)
 * - Mailgun (Similar pricing to SendGrid)
 * - But Gmail is PERFECT for learning and small apps!
 *
 * JAVA CODE EXAMPLE (Next Phase):
 * ```java
 * 
 * @Autowired
 *            private JavaMailSender mailSender;
 *
 *            public void sendVerificationEmail(String to, String token) {
 *            String link = "http://localhost:3000/verify?token=" + token;
 *
 *            MimeMessage message = mailSender.createMimeMessage();
 *            MimeMessageHelper helper = new MimeMessageHelper(message, true);
 *
 *            helper.setTo(to);
 *            helper.setSubject("Verify Your Email");
 *            helper.setText(htmlContent, true); // true = HTML
 *
 *            mailSender.send(message);
 *            }
 *            ```
 *
 *            TESTING:
 *            You can test emails by:
 *            1. Using your own Gmail to receive test emails
 *            2. Using temp email services (temp-mail.org)
 *            3. Using Mailtrap for development (catches emails, doesn't send)
 *
 *            ============================================================================
 *            NEXT PHASE: We'll implement the complete Email Service!
 *            ============================================================================
 */
