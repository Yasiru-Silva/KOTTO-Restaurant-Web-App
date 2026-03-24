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

        // 1) Find logged-in user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiError(HttpStatus.UNAUTHORIZED, "Please login"));

        // DTO validation already guarantees:
        // name not blank, phone format, date/start/end not null, guests 1-20, seatingType not null

        LocalTime start = request.getStartTime();
        LocalTime end = request.getEndTime();

        // 2) End must be after start
        if (!end.isAfter(start)) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }

        // 3) 30-min steps (00 or 30)
        if (!isValidStep(start) || !isValidStep(end)) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "Time must be in 30-minute steps (minutes 00 or 30)");
        }

        // 4) Opening hours: 11:00 - 23:00 (end cannot go beyond 23:00)
        LocalTime open = LocalTime.of(11, 0);
        LocalTime close = LocalTime.of(23, 0);

        if (start.isBefore(open) || start.isAfter(close)) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "Start time must be between 11:00 and 23:00");
        }
        if (end.isBefore(open) || end.isAfter(close)) {
            throw new ApiError(HttpStatus.BAD_REQUEST, "End time must be between 11:00 and 23:00");
        }

        // 5) Same-day “at least 2 hours from now”
        if (request.getDate().equals(LocalDate.now())) {
            LocalTime minStart = LocalTime.now().plusHours(2);
            if (start.isBefore(minStart)) {
                throw new ApiError(HttpStatus.BAD_REQUEST, "Reservation must be at least 2 hours from now");
            }
        }

        // 6) Save
        Reservation r = new Reservation();
        r.setUser(user);
        r.setName(request.getName().trim());
        r.setPhone(request.getPhone());
        r.setDate(request.getDate());
        r.setStartTime(start);
        r.setEndTime(end);
        r.setGuests(request.getGuests());
        r.setSeatingType(request.getSeatingType());
        r.setStatus(ReservationStatus.PENDING);

        Reservation saved = reservationRepository.save(r);

        String msg = "✅ Booking saved! Here is your booking number: "
                + saved.getId()
                + " and your name: "
                + saved.getName();

        return new CreateReservationResponse(saved.getId(), saved.getStatus(), msg);
    }

    private boolean isValidStep(LocalTime t) {
        return t.getMinute() == 0 || t.getMinute() == 30;
    }

    @Override
    public List<ReservationResponseDto> getUserReservations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiError(HttpStatus.UNAUTHORIZED, "Please login"));

        List<Reservation> reservations = reservationRepository.findByUser_Id(user.getId());
        
        return reservations.stream().map(r -> new ReservationResponseDto(
                r.getId(),
                r.getName(),
                r.getPhone(),
                r.getDate(),
                r.getStartTime(),
                r.getEndTime(),
                r.getGuests(),
                r.getSeatingType(),
                r.getStatus()
        )).collect(Collectors.toList());
    }
}