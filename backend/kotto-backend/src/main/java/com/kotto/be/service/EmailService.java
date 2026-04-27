package com.kotto.be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Send password reset email to user
     * @param toEmail recipient email
     * @param rawToken the raw token (NOT hashed) to be sent to user
     */
    public void sendPasswordResetEmail(String toEmail, String rawToken) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + rawToken;
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request - KOTTO Restaurant");
            message.setText(buildEmailBody(resetLink));

            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}", toEmail, e);
            // Do not throw exception - log and continue
            // This follows the security principle of not revealing email existence
        }
    }

    /**
     * Build HTML-like email body for password reset
     */
    private String buildEmailBody(String resetLink) {
        return "Hello,\n\n" +
                "You requested a password reset for your KOTTO Restaurant account.\n\n" +
                "Click the link below to reset your password:\n" +
                resetLink + "\n\n" +
                "This link will expire in 30 minutes.\n\n" +
                "If you did not request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "KOTTO Restaurant Team";
    }
}
