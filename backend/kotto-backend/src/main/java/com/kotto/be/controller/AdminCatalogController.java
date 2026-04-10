package com.kotto.be.controller;

import com.kotto.be.dto.CategoryDTO;
import com.kotto.be.dto.MoodDTO;
import com.kotto.be.service.CategoryService;
import com.kotto.be.service.MoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminCatalogController {

    private final CategoryService categoryService;
    private final MoodService moodService;

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody Map<String, String> body) {
        String name = body != null ? body.get("name") : null;
        return ResponseEntity.ok(categoryService.create(name));
    }

    @PostMapping("/moods")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MoodDTO> createMood(@RequestBody Map<String, String> body) {
        String name = body != null ? body.get("name") : null;
        return ResponseEntity.ok(moodService.create(name));
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/moods/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMood(@PathVariable Long id) {
        moodService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
