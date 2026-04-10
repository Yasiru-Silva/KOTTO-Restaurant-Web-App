package com.kotto.be.controller;

import com.kotto.be.dto.MenuDTO;
import com.kotto.be.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminMenuController {

    private final MenuService menuService;

    @GetMapping("/items/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuDTO> getMenuItem(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuItemById(id));
    }

    @PostMapping(value = "/items", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuDTO> createMenuItem(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam double price,
            @RequestParam Long categoryId,
            @RequestParam(required = false) List<Long> moodIds,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(defaultValue = "false") boolean bestSeller
    ) {
        MenuDTO created = menuService.createMenuItem(
                name,
                description,
                price,
                categoryId,
                moodIds,
                image,
                bestSeller
        );
        return ResponseEntity.ok(created);
    }

    @PutMapping(value = "/items/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuDTO> updateMenuItem(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam double price,
            @RequestParam Long categoryId,
            @RequestParam(required = false) List<Long> moodIds,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(defaultValue = "false") boolean bestSeller
    ) {
        MenuDTO updated = menuService.updateMenuItem(
                id,
                name,
                description,
                price,
                categoryId,
                moodIds,
                image,
                bestSeller
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
