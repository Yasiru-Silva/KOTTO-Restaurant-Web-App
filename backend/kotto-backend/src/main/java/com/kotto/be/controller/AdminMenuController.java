package com.kotto.be.controller;

import com.kotto.be.model.enums.Role;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/menu")
public class AdminMenuController {

    // Only ADMIN can access
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public String getAllMenuItems() {
        return "This will return all menu items for admin";
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public String createMenuItem() {
        return "This will create a menu item (ADMIN only)";
    }
}