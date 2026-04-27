package com.kotto.be.controller;

import com.kotto.be.dto.CreateIngredientRequest;
import com.kotto.be.dto.IngredientResponseDto;
import com.kotto.be.dto.UpdateIngredientRequest;
import com.kotto.be.service.IngredientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/inventory")
@PreAuthorize("hasRole('ADMIN')")
public class AdminInventoryController {

    private final IngredientService ingredientService;

    public AdminInventoryController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public ResponseEntity<List<IngredientResponseDto>> getAllIngredients() {
        return ResponseEntity.ok(ingredientService.getAllIngredients());
    }

    @PostMapping
    public ResponseEntity<IngredientResponseDto> createIngredient(
            @Valid @RequestBody CreateIngredientRequest request
    ) {
        IngredientResponseDto created = ingredientService.createIngredient(request);
        return ResponseEntity
                .created(URI.create("/api/admin/inventory/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredientResponseDto> updateIngredient(
            @PathVariable Long id,
            @Valid @RequestBody UpdateIngredientRequest request
    ) {
        return ResponseEntity.ok(ingredientService.updateIngredient(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteIngredient(@PathVariable Long id) {
        ingredientService.deleteIngredient(id);
        return ResponseEntity.ok(Map.of("message", "Ingredient deleted successfully"));
    }
}