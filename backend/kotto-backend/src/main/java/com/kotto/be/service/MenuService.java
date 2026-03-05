package com.kotto.be.service;

import com.kotto.be.dto.MenuDTO;
import com.kotto.be.model.MenuItem;
import com.kotto.be.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    public List<MenuDTO> getAllMenuItems() {
        return menuRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private MenuDTO mapToDTO(MenuItem item) {
        return new MenuDTO(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.getImageUrl()
        );
    }
}