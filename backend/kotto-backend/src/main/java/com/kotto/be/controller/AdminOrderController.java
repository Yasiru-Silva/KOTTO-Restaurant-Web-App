package com.kotto.be.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public String getAllOrders() {
        return "ADMIN: list all orders";
    }

    @PutMapping("/update-status")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateOrderStatus() {
        return "ADMIN: update order status to COMPLETED";
    }
}