package com.kotto.be.service;

import com.kotto.be.dto.OrderDTO;
import com.kotto.be.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public List<OrderDTO> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream()
            .map(order -> OrderDTO.builder()
                .id(order.getId())
                .total(order.getTotal())
                .status(order.getStatus())
                .build())
            .collect(Collectors.toList());
    }
}
