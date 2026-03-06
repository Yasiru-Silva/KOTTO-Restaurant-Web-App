package com.kotto.be.service;

import com.kotto.be.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final Key key;
    private final long expirationMillis;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMillis
    ) {
        // HS256 needs 32+ char secret
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationMillis;
    }

    // ---- Token creation ----
    public String generateToken(String subjectEmail, Role role, Long userId) {
        Instant now = Instant.now();
        Instant exp = now.plusMillis(expirationMillis);

        return Jwts.builder()
                .setSubject(subjectEmail)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .addClaims(Map.of(
                        "role", role.name(),
                        "userId", userId
                ))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ---- Token validation / parsing (needed by JwtAuthenticationFilter) ----
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, String email) {
        return email != null
                && email.equals(extractUsername(token))
                && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        Date exp = extractClaim(token, Claims::getExpiration);
        return exp.before(new Date());
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Optional helpers (useful later)
    public String extractRole(String token) {
        Object role = extractAllClaims(token).get("role");
        return role == null ? null : role.toString();
    }

    public Long extractUserId(String token) {
        Object id = extractAllClaims(token).get("userId");
        if (id == null) return null;
        if (id instanceof Number n) return n.longValue();
        return Long.parseLong(id.toString());
    }
}