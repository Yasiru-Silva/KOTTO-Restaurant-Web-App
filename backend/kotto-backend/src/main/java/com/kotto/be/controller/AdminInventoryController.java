package com.kotto.be.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/inventory")
public class AdminInventoryController {

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public String listIngredients() {
        return "ADMIN: list ingredients";
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public String addIngredient() {
        return "ADMIN: add ingredient";
    }

    @PutMapping("/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public String editIngredient() {
        return "ADMIN: edit ingredient";
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteIngredient() {
        return "ADMIN: delete ingredient";
    }
}