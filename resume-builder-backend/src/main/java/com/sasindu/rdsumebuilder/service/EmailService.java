package com.sasindu.rdsumebuilder.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * EMAIL SERVICE - Send Emails via Gmail SMTP (FREE!)
 *
 * This service handles all email operations for the application.
 * Uses Gmail's SMTP server which is completely free (500 emails/day).
 *
 * Key Features:
 * - Asynchronous email sending (@Async)
 * - HTML email templates
 * - Verification emails
 * - Password reset emails
 * - Welcome emails
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    /**
     * Send email verification link to new users
     */
    @Async
    public void sendVerificationEmail(String to, String name, String verificationToken) {
        try {
            String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;
            String subject = "Verify Your Email - Resume Builder";
            String htmlContent = buildVerificationEmailTemplate(name, verificationLink);

            sendHtmlEmail(to, subject, htmlContent);
            log.info("Verification email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", to, e);
        }
    }

    /**
     * Send password reset link to users
     */
    @Async
    public void sendPasswordResetEmail(String to, String name, String resetToken) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
            String subject = "Reset Your Password - Resume Builder";
            String htmlContent = buildPasswordResetEmailTemplate(name, resetLink);

            sendHtmlEmail(to, subject, htmlContent);
            log.info("Password reset email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", to, e);
        }
    }

    /**
     * Send welcome email after successful verification
     */
    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            String subject = "Welcome to Resume Builder! 🎉";
            String htmlContent = buildWelcomeEmailTemplate(name);

            sendHtmlEmail(to, subject, htmlContent);
            log.info("Welcome email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", to, e);
        }
    }

    /**
     * Core method to send HTML emails via SMTP
     */
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    /**
     * HTML template for email verification
     * Note: %% is used to escape % in formatted strings
     */
    private String buildVerificationEmailTemplate(String name, String verificationLink) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                <h1 style="color: white; margin: 0; font-size: 28px;">Resume Builder</h1>
                            </div>
                            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                                <h2 style="color: #667eea; margin-top: 0;">Verify Your Email Address</h2>
                                <p>Hi <strong>%s</strong>,</p>
                                <p>Thank you for registering with Resume Builder! 🎉</p>
                                <p>To complete your registration, please verify your email address by clicking the button below:</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="%s" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                        Verify Email Address
                                    </a>
                                </div>
                                <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link:</p>
                                <p style="background: white; padding: 10px; border-left: 4px solid #667eea; word-break: break-all; font-size: 12px;">%s</p>
                                <p style="color: #e74c3c; margin-top: 30px;">⚠️ This link expires in 24 hours.</p>
                                <p style="color: #666; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                                    If you didn't create an account, please ignore this email.
                                </p>
                            </div>
                            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                                <p>&copy; 2025 Resume Builder. All rights reserved.</p>
                            </div>
                        </body>
                        </html>
                        """,
                name, verificationLink, verificationLink);
    }

    /**
     * HTML template for password reset
     */
    private String buildPasswordResetEmailTemplate(String name, String resetLink) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <div style="background: linear-gradient(135deg, #f093fb 0%%, #f5576c 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                <h1 style="color: white; margin: 0; font-size: 28px;">Resume Builder</h1>
                            </div>
                            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                                <h2 style="color: #f5576c; margin-top: 0;">Reset Your Password</h2>
                                <p>Hi <strong>%s</strong>,</p>
                                <p>We received a request to reset your password for your Resume Builder account.</p>
                                <p>Click the button below to choose a new password:</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="%s" style="background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                        Reset Password
                                    </a>
                                </div>
                                <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link:</p>
                                <p style="background: white; padding: 10px; border-left: 4px solid #f5576c; word-break: break-all; font-size: 12px;">%s</p>
                                <p style="color: #e74c3c; margin-top: 30px;">⚠️ This link expires in 1 hour for security.</p>
                                <p style="color: #666; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                                    If you didn't request a password reset, please ignore this email.
                                </p>
                            </div>
                            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                                <p>&copy; 2025 Resume Builder. All rights reserved.</p>
                            </div>
                        </body>
                        </html>
                        """,
                name, resetLink, resetLink);
    }

    /**
     * HTML template for welcome email
     */
    private String buildWelcomeEmailTemplate(String name) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <div style="background: linear-gradient(135deg, #43e97b 0%%, #38f9d7 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome!</h1>
                            </div>
                            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                                <h2 style="color: #43e97b; margin-top: 0;">Welcome to Resume Builder!</h2>
                                <p>Hi <strong>%s</strong>,</p>
                                <p>Your email has been verified successfully! 🎊</p>
                                <p>You now have full access to all Resume Builder features:</p>
                                <ul style="line-height: 2;">
                                    <li>✨ Create professional resumes with multiple templates</li>
                                    <li>🎨 Customize colors and themes</li>
                                    <li>📄 Download as PDF</li>
                                    <li>💾 Save and manage multiple resumes</li>
                                    <li>🚀 Share your resume via link</li>
                                </ul>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="%s/dashboard" style="background: #43e97b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                        Go to Dashboard
                                    </a>
                                </div>
                                <p style="color: #666; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                                    Need help? Reply to this email or visit our support center.
                                </p>
                            </div>
                            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                                <p>&copy; 2025 Resume Builder. All rights reserved.</p>
                            </div>
                        </body>
                        </html>
                        """,
                name, frontendUrl);
    }
}
