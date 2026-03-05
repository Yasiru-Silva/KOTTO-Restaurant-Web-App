package com.kotto.be.dto;

import com.kotto.be.model.enums.SeatingType;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;

public class CreateReservationRequest {

    @NotBlank(message = "Name is required")
    private String name;

    // Sri Lanka format: 07XXXXXXXX (10 chars)
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^07\\d{8}$", message = "Phone must be in Sri Lanka format: 07XXXXXXXX")
    private String phone;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Min(value = 1, message = "Guests must be at least 1")
    @Max(value = 20, message = "Guests must be at most 20")
    private int guests;

    @NotNull(message = "Seating type is required")
    private SeatingType seatingType;

    public CreateReservationRequest() {}

    public String getName() { return name; }
    public String getPhone() { return phone; }
    public LocalDate getDate() { return date; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public int getGuests() { return guests; }
    public SeatingType getSeatingType() { return seatingType; }

    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public void setGuests(int guests) { this.guests = guests; }
    public void setSeatingType(SeatingType seatingType) { this.seatingType = seatingType; }
}