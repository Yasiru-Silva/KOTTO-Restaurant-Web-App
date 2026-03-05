package com.kotto.be.service;

import com.kotto.be.dto.CreateReservationRequest;
import com.kotto.be.dto.CreateReservationResponse;

public interface ReservationService {
    CreateReservationResponse create(CreateReservationRequest request, String userEmail);
}