package com.kotto.be.service.impl;

import com.kotto.be.common.exception.ApiException;
import com.kotto.be.dto.CreateIngredientRequest;
import com.kotto.be.dto.IngredientResponseDto;
import com.kotto.be.dto.UpdateIngredientRequest;
import com.kotto.be.model.Ingredient;
import com.kotto.be.repository.IngredientRepository;
import com.kotto.be.service.IngredientService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientServiceImpl implements IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientServiceImpl(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    @Override
    public List<IngredientResponseDto> getAllIngredients() {
        return ingredientRepository.findAll()
                .stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public IngredientResponseDto createIngredient(CreateIngredientRequest request) {
        String normalizedName = normalizeName(request.getName());

        if (ingredientRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Ingredient with this name already exists");
        }

        Ingredient ingredient = Ingredient.builder()
                .name(normalizedName)
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .build();

        Ingredient saved = ingredientRepository.save(ingredient);
        return mapToDto(saved);
    }

    @Override
    public IngredientResponseDto updateIngredient(Long id, UpdateIngredientRequest request) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ingredient not found"));

        String normalizedName = normalizeName(request.getName());

        ingredientRepository.findByNameIgnoreCase(normalizedName)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new ApiException(HttpStatus.BAD_REQUEST, "Ingredient with this name already exists");
                    }
                });

        ingredient.setName(normalizedName);
        ingredient.setQuantity(request.getQuantity());
        ingredient.setUnit(request.getUnit());

        Ingredient saved = ingredientRepository.save(ingredient);
        return mapToDto(saved);
    }

    @Override
    public void deleteIngredient(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ingredient not found"));

        ingredientRepository.delete(ingredient);
    }

    private String normalizeName(String name) {
        String value = name == null ? "" : name.trim().replaceAll("\\s+", " ");
        if (value.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Ingredient name is required");
        }
        return value;
    }

    private IngredientResponseDto mapToDto(Ingredient ingredient) {
        return new IngredientResponseDto(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getQuantity(),
                ingredient.getUnit(),
                ingredient.getCreatedAt(),
                ingredient.getUpdatedAt()
        );
    }
}