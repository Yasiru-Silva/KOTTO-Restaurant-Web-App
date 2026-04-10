package com.kotto.be.dto;

import com.kotto.be.model.enums.IngredientUnit;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class IngredientResponseDto {
    private Long id;
    private String name;
    private BigDecimal quantity;
    private IngredientUnit unit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}