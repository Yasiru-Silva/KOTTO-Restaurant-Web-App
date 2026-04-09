package com.kotto.be.controller;

import com.kotto.be.dto.OrderDTO;
import com.kotto.be.model.User;
import com.kotto.be.repository.UserRepository;
import com.kotto.be.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(orderService.getUserOrders(user.getId()));
    }
}
