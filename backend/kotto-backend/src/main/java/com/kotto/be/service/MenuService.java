package com.kotto.be.service;

import com.kotto.be.dto.CategoryDTO;
import com.kotto.be.dto.MenuDTO;
import com.kotto.be.dto.MoodDTO;
import com.kotto.be.model.FoodCategory;
import com.kotto.be.model.MenuItem;
import com.kotto.be.model.Mood;
import com.kotto.be.repository.FoodCategoryRepository;
import com.kotto.be.repository.MenuRepository;
import com.kotto.be.repository.MoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final FoodCategoryRepository foodCategoryRepository;
    private final MoodRepository moodRepository;
    private final FileStorageService fileStorageService;

    public List<MenuDTO> getAllMenuItems(Long moodId, Long categoryId) {
        List<MenuItem> items = menuRepository.findAllWithRelations();
        if (categoryId != null) {
            items = items.stream()
                    .filter(m -> m.getCategory() != null
                            && Objects.equals(m.getCategory().getId(), categoryId))
                    .collect(Collectors.toList());
        }
        if (moodId != null) {
            items = items.stream()
                    .filter(m -> m.getMoods() != null && m.getMoods().stream()
                            .anyMatch(mood -> Objects.equals(mood.getId(), moodId)))
                    .collect(Collectors.toList());
        }
        return items.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public MenuDTO getMenuItemById(Long id) {
        MenuItem item = menuRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
        return mapToDTO(item);
    }

    @Transactional
    public MenuDTO createMenuItem(
            String name,
            String description,
            double price,
            Long categoryId,
            List<Long> moodIds,
            MultipartFile image,
            boolean bestSeller
    ) {
        String trimmedName = name == null ? "" : name.trim();
        if (trimmedName.isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (menuRepository.findByName(trimmedName).isPresent()) {
            throw new IllegalArgumentException("A menu item with this name already exists");
        }
        if (categoryId == null) {
            throw new IllegalArgumentException("Category is required");
        }
        if (price <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero");
        }
        FoodCategory category = foodCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid category"));

        MenuItem item = new MenuItem();
        item.setName(trimmedName);
        item.setDescription(description != null ? description.trim() : null);
        item.setPrice(price);
        item.setBestSeller(bestSeller);
        item.setCategory(category);

        Set<Mood> moods = new HashSet<>();
        if (moodIds != null) {
            for (Long mid : moodIds) {
                if (mid != null) {
                    moodRepository.findById(mid).ifPresent(moods::add);
                }
            }
        }
        item.setMoods(moods);

        if (image != null && !image.isEmpty()) {
            try {
                String imagePath = fileStorageService.storeImage(image);
                item.setImageUrl(imagePath);
            } catch (IOException e) {
                throw new IllegalArgumentException("Could not save image");
            }
        }

        item = menuRepository.save(item);
        return mapToDTO(item);
    }

    @Transactional
    public MenuDTO updateMenuItem(
            Long id,
            String name,
            String description,
            double price,
            Long categoryId,
            List<Long> moodIds,
            MultipartFile image,
            boolean bestSeller
    ) {
        MenuItem item = menuRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));

        String trimmedName = name == null ? "" : name.trim();
        if (trimmedName.isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        menuRepository.findByName(trimmedName).ifPresent(other -> {
            if (!Objects.equals(other.getId(), id)) {
                throw new IllegalArgumentException("A menu item with this name already exists");
            }
        });
        if (categoryId == null) {
            throw new IllegalArgumentException("Category is required");
        }
        if (price <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero");
        }
        FoodCategory category = foodCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid category"));

        item.setName(trimmedName);
        item.setDescription(description != null ? description.trim() : null);
        item.setPrice(price);
        item.setBestSeller(bestSeller);
        item.setCategory(category);

        Set<Mood> moods = new HashSet<>();
        if (moodIds != null) {
            for (Long mid : moodIds) {
                if (mid != null) {
                    moodRepository.findById(mid).ifPresent(moods::add);
                }
            }
        }
        item.setMoods(moods);

        if (image != null && !image.isEmpty()) {
            fileStorageService.deleteByPublicPath(item.getImageUrl());
            try {
                String imagePath = fileStorageService.storeImage(image);
                item.setImageUrl(imagePath);
            } catch (IOException e) {
                throw new IllegalArgumentException("Could not save image");
            }
        }

        item = menuRepository.save(item);
        return mapToDTO(item);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem item = menuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
        fileStorageService.deleteByPublicPath(item.getImageUrl());
        menuRepository.delete(item);
    }

    private MenuDTO mapToDTO(MenuItem item) {
        CategoryDTO cat = null;
        if (item.getCategory() != null) {
            FoodCategory c = item.getCategory();
            cat = new CategoryDTO(c.getId(), c.getName());
        }
        List<MoodDTO> moodDtos = item.getMoods() == null ? List.of() :
                item.getMoods().stream()
                        .map(m -> new MoodDTO(m.getId(), m.getName()))
                        .collect(Collectors.toList());

        return new MenuDTO(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.getImageUrl(),
                item.isBestSeller(),
                cat,
                moodDtos
        );
    }
}
