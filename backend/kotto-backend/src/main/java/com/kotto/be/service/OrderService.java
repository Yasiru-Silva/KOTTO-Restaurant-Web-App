package com.kotto.be.service;

import com.kotto.be.dto.OrderDTO;
import com.kotto.be.dto.OrderRequestDTO;
import com.kotto.be.model.Order;
import com.kotto.be.model.OrderItem;
import com.kotto.be.model.User;
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

    public Order placeOrder(User user, OrderRequestDTO request) {
        Order order = new Order();
        order.setUser(user);
        order.setTotal(request.getTotal());
        order.setStatus("CONFIRMED");
        order.setOrderType(request.getOrderType());
        order.setDeliveryAddress(request.getDeliveryAddress());

        if (request.getItems() != null) {
            List<OrderItem> items = request.getItems().stream().map(dto -> {
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setItemName(dto.getName());
                item.setPrice(dto.getPrice());
                item.setQuantity(dto.getQuantity());
                return item;
            }).collect(Collectors.toList());
            order.setItems(items);
        }

        return orderRepository.save(order);
    }
}
