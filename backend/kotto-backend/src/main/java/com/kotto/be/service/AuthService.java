package com.kotto.be.service;

import com.kotto.be.common.exception.ApiException;
import org.springframework.http.HttpStatus;
import com.kotto.be.dto.AuthResponse;
import com.kotto.be.dto.ForgotPasswordRequest;
import com.kotto.be.dto.LoginRequest;
import com.kotto.be.dto.RegisterRequest;
import com.kotto.be.dto.ResetPasswordRequest;
import com.kotto.be.model.PasswordResetToken;
import com.kotto.be.model.Role;
import com.kotto.be.model.User;
import com.kotto.be.repository.PasswordResetTokenRepository;
import com.kotto.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    private static final int PASSWORD_RESET_TOKEN_EXPIRY_MINUTES = 30;

    public AuthResponse register(RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT,"Email is already registered");
        }

        User user = User.builder()
                .name(req.getName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(Role.USER)
                .build();

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getEmail(), saved.getRole(), saved.getId());
        return new AuthResponse(token, saved.getRole(), saved.getId(), saved.getEmail(), saved.getName());
    }

    public AuthResponse login(LoginRequest req) {
        String email = req.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED,"Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,"Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getId());
        return new AuthResponse(token, user.getRole(), user.getId(), user.getEmail(), user.getName());
    }

    /**
     * Initiate password reset process
     * SECURITY: Always returns success message even if email doesn't exist
     * This prevents email enumeration attacks
     */
    @Transactional
    public void forgotPassword(ForgotPasswordRequest req) {
        String email = req.getEmail().trim().toLowerCase();

        // Attempt to find user - but don't throw exception if not found
        var userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Generate raw token (to send to email)
            String rawToken = UUID.randomUUID().toString();
            
            // Hash token before storing in DB
            String hashedToken = passwordEncoder.encode(rawToken);
            
            // Delete any existing tokens for this user
            passwordResetTokenRepository.deleteByUser(user);
            
            // Create and save new reset token
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .tokenHash(hashedToken)
                    .expiryDate(LocalDateTime.now().plusMinutes(PASSWORD_RESET_TOKEN_EXPIRY_MINUTES))
                    .used(false)
                    .user(user)
                    .build();
            
            passwordResetTokenRepository.save(resetToken);
            
            // Send email with raw token
            emailService.sendPasswordResetEmail(user.getEmail(), rawToken);
            log.info("Password reset initiated for user: {}", email);
        } else {
            log.warn("Password reset requested for non-existent email: {}", email);
        }
        
        // Always return success to prevent email enumeration
    }

    /**
     * Reset password using token
     * SECURITY: Token must be hashed before comparing with DB
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        String rawToken = req.getToken().trim();
        
        // Validate password format
        if (req.getNewPassword().length() < 6) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }
        
        // Find token with brute-force protection:
        // We need to iterate through tokens and compare hashes (bcrypt comparison)
        var allTokens = passwordResetTokenRepository.findAll();
        PasswordResetToken validToken = null;
        
        for (PasswordResetToken token : allTokens) {
            if (passwordEncoder.matches(rawToken, token.getTokenHash())) {
                validToken = token;
                break;
            }
        }
        
        if (validToken == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid or expired reset token");
        }
        
        // Validate token state
        if (validToken.getUsed()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This reset token has already been used");
        }
        
        if (!validToken.isValid()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }
        
        // Get user and update password
        User user = validToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        
        // Mark token as used
        validToken.setUsed(true);
        passwordResetTokenRepository.save(validToken);
        
        log.info("Password reset completed for user: {}", user.getEmail());
    }
}