package com.kotto.be.service.impl;

import com.kotto.be.dto.CreateReservationRequest;
import com.kotto.be.dto.CreateReservationResponse;
import com.kotto.be.dto.ReservationResponseDto;
import com.kotto.be.exception.ApiError;
import com.kotto.be.model.Reservation;
import com.kotto.be.model.User;
import com.kotto.be.model.enums.ReservationStatus;
import com.kotto.be.repository.ReservationRepository;
import com.kotto.be.repository.UserRepository;
import com.kotto.be.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                  UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CreateReservationResponse create(CreateReservationRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiError(HttpStatus.UNAUTHORIZED, "Please login"));

        LocalTime start = request.getStartTime();
        LocalTime end = request.getEndTime();

        if (!end.isAfter(start)) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }

        if (!isValidStep(start) || !isValidStep(end)) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "Time must be in 30-minute steps (minutes 00 or 30)");
        }

        LocalTime open = LocalTime.of(11, 0);
        LocalTime close = LocalTime.of(23, 0);

        if (start.isBefore(open) || start.isAfter(close)) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "Start time must be between 11:00 and 23:00");
        }

        if (end.isBefore(open) || end.isAfter(close)) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "End time must be between 11:00 and 23:00");
        }

        if (request.getDate().equals(LocalDate.now())) {
            LocalTime minStart = LocalTime.now().plusHours(2);
            if (start.isBefore(minStart)) {
                throw new ApiError(HttpStatus.BAD_REQUEST, "Reservation must be at least 2 hours from now");
            }
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setName(request.getName().trim());
        reservation.setPhone(request.getPhone());
        reservation.setDate(request.getDate());
        reservation.setStartTime(start);
        reservation.setEndTime(end);
        reservation.setGuests(request.getGuests());
        reservation.setSeatingType(request.getSeatingType());
        reservation.setStatus(ReservationStatus.PENDING);

        Reservation saved = reservationRepository.save(reservation);

        String msg = "✅ Booking saved! Here is your booking number: "
                + saved.getId()
                + " and your name: "
                + saved.getName();

        return new CreateReservationResponse(saved.getId(), saved.getStatus(), msg);
    }

    @Override
    public List<ReservationResponseDto> getUserReservations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiError(HttpStatus.UNAUTHORIZED, "Please login"));

        return reservationRepository.findByUser_Id(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponseDto> getAllReservations() {
        return reservationRepository.findAllByOrderByDateAscStartTimeAsc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReservationResponseDto approveReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ApiError(HttpStatus.NOT_FOUND, "Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "Only pending reservations can be approved");
        }

        reservation.setStatus(ReservationStatus.APPROVED);
        Reservation saved = reservationRepository.save(reservation);

        return mapToDto(saved);
    }

    @Override
    public ReservationResponseDto rejectReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ApiError(HttpStatus.NOT_FOUND, "Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "Only pending reservations can be rejected");
        }

        reservation.setStatus(ReservationStatus.REJECTED);
        Reservation saved = reservationRepository.save(reservation);

        return mapToDto(saved);
    }

    private boolean isValidStep(LocalTime t) {
        return t.getMinute() == 0 || t.getMinute() == 30;
    }

    private ReservationResponseDto mapToDto(Reservation r) {
        return new ReservationResponseDto(
                r.getId(),
                r.getName(),
                r.getPhone(),
                r.getDate(),
                r.getStartTime(),
                r.getEndTime(),
                r.getGuests(),
                r.getSeatingType(),
                r.getStatus()
        );
    }
}