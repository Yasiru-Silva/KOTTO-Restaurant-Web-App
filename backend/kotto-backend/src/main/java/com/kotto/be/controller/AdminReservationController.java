package com.kotto.be.controller;

import com.kotto.be.dto.ReservationResponseDto;
import com.kotto.be.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {

    private final ReservationService reservationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReservationResponseDto> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ReservationResponseDto approveReservation(@PathVariable Long id) {
        return reservationService.approveReservation(id);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ReservationResponseDto rejectReservation(@PathVariable Long id) {
        return reservationService.rejectReservation(id);
    }
}