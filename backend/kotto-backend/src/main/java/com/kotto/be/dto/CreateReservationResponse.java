package com.kotto.be.dto;

import com.kotto.be.model.enums.ReservationStatus;

public class CreateReservationResponse {

    private Long id;
    private ReservationStatus status;
    private String message;

    public CreateReservationResponse(Long id, ReservationStatus status, String message) {
        this.id = id;
        this.status = status;
        this.message = message;
    }

    public Long getId() { return id; }
    public ReservationStatus getStatus() { return status; }
    public String getMessage() { return message; }
}