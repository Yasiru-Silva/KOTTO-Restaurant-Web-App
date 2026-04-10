package com.kotto.be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuDTO {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private boolean bestSeller;
    private CategoryDTO category;
    private List<MoodDTO> moods;
}
