package com.kotto.be.dto;

import com.kotto.be.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Role role;
    private Long userId;
    private String email;
    private String name;
}