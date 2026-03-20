package com.kotto.be.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reservations")
public class AdminReservationController {

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public String getAllReservations() {
        return "ADMIN: list all reservations";
    }

    @PutMapping("/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public String approveReservation() {
        return "ADMIN: approve reservation";
    }

    @PutMapping("/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public String rejectReservation() {
        return "ADMIN: reject reservation";
    }
}