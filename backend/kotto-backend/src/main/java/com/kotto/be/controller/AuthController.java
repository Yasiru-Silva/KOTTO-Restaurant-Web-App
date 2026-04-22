package com.kotto.be.controller;

import com.kotto.be.dto.AuthResponse;
import com.kotto.be.dto.ForgotPasswordRequest;
import com.kotto.be.dto.LoginRequest;
import com.kotto.be.dto.RegisterRequest;
import com.kotto.be.dto.ResetPasswordRequest;
import com.kotto.be.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    /**
     * Initiate password reset process
     * SECURITY: Always returns 200 OK with success message,
     * even if email doesn't exist (prevents email enumeration)
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "If an account exists with this email, a password reset link has been sent");
        return ResponseEntity.ok(response);
    }

    /**
     * Reset password using token from email
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password has been reset successfully. You can now login with your new password");
        return ResponseEntity.ok(response);
    }
}