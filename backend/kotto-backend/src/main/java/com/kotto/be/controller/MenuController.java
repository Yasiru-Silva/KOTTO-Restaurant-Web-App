package com.kotto.be.controller;

import com.kotto.be.dto.MenuDTO;
import com.kotto.be.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // allow frontend calls from different domain
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuDTO>> getMenuItems() {
        List<MenuDTO> menuItems = menuService.getAllMenuItems();
        return ResponseEntity.ok(menuItems);
    }
}