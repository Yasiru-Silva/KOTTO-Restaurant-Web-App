package com.kotto.be.controller;

import com.kotto.be.dto.CreateReservationRequest;
import com.kotto.be.dto.CreateReservationResponse;
import com.kotto.be.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public CreateReservationResponse create(
            @Valid @RequestBody CreateReservationRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName(); // comes from JWT subject (email)
        return reservationService.create(request, userEmail);
    }
}