package com.kotto.be.service;

import com.kotto.be.dto.CategoryDTO;
import com.kotto.be.model.FoodCategory;
import com.kotto.be.repository.FoodCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final FoodCategoryRepository foodCategoryRepository;

    public List<CategoryDTO> getAll() {
        return foodCategoryRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder", "name"))
                .stream()
                .map(c -> new CategoryDTO(c.getId(), c.getName()))
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO create(String name) {
        String trimmed = name == null ? "" : name.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }
        if (foodCategoryRepository.existsByNameIgnoreCase(trimmed)) {
            throw new IllegalArgumentException("Category already exists");
        }
        FoodCategory c = new FoodCategory();
        c.setName(trimmed);
        c.setSortOrder(0);
        c = foodCategoryRepository.save(c);
        return new CategoryDTO(c.getId(), c.getName());
    }

    @Transactional
    public void delete(Long id) {
        foodCategoryRepository.deleteById(id);
    }
}
