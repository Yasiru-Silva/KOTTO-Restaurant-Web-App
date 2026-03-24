package com.kotto.be.service;

import com.kotto.be.dto.CreateReservationRequest;
import com.kotto.be.dto.CreateReservationResponse;
import com.kotto.be.dto.ReservationResponseDto;

import java.util.List;

public interface ReservationService {
    CreateReservationResponse create(CreateReservationRequest request, String userEmail);

    List<ReservationResponseDto> getUserReservations(String userEmail);

    List<ReservationResponseDto> getAllReservations();

    ReservationResponseDto approveReservation(Long reservationId);

    ReservationResponseDto rejectReservation(Long reservationId);
}