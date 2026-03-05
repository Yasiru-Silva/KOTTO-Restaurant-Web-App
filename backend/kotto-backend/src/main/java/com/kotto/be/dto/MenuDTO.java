package com.kotto.be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MenuDTO {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
}