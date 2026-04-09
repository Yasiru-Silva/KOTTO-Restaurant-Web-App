package com.kotto.be.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {
    private String orderType;
    private String deliveryAddress;
    private Double total;
    private List<OrderItemRequestDTO> items;
}
