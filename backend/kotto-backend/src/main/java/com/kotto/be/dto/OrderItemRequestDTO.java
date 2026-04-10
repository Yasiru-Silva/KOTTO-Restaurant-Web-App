package com.kotto.be.dto;

import lombok.Data;

@Data
public class OrderItemRequestDTO {
    private Long id;
    private String name;
    private Double price;
    private Integer quantity;
}
