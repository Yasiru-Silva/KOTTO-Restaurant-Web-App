package com.kotto.be.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Hashed token (NOT stored as plain text for security)
     * The raw token is only sent to the user's email
     */
    @Column(nullable = false, unique = true, length = 255)
    private String tokenHash;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    /**
     * Flag to ensure token is single-use
     */
    @Column(nullable = false)
    private Boolean used = false;

    /**
     * ManyToOne relationship with User
     * If user is deleted, cascade the token deletion
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Check if token is valid (not expired and not used)
     */
    public boolean isValid() {
        return !used && expiryDate.isAfter(LocalDateTime.now());
    }
}
