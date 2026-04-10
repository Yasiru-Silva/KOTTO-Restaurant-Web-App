package com.kotto.be.service;

import com.kotto.be.dto.CreateIngredientRequest;
import com.kotto.be.dto.IngredientResponseDto;
import com.kotto.be.dto.UpdateIngredientRequest;

import java.util.List;

public interface IngredientService {

    List<IngredientResponseDto> getAllIngredients();

    IngredientResponseDto createIngredient(CreateIngredientRequest request);

    IngredientResponseDto updateIngredient(Long id, UpdateIngredientRequest request);

    void deleteIngredient(Long id);
}