package com.kotto.be.service;

import com.kotto.be.common.exception.ApiException;
import org.springframework.http.HttpStatus;
import com.kotto.be.dto.AuthResponse;
import com.kotto.be.dto.LoginRequest;
import com.kotto.be.dto.RegisterRequest;
import com.kotto.be.model.Role;
import com.kotto.be.model.User;
import com.kotto.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

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
}