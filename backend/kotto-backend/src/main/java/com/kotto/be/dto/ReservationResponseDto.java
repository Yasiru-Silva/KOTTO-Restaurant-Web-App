package com.kotto.be.dto;

import com.kotto.be.model.enums.ReservationStatus;
import com.kotto.be.model.enums.SeatingType;
import java.time.LocalDate;
import java.time.LocalTime;

public class ReservationResponseDto {
    private Long id;
    private String name;
    private String phone;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private int guests;
    private SeatingType seatingType;
    private ReservationStatus status;

    public ReservationResponseDto() {}

    public ReservationResponseDto(Long id, String name, String phone, LocalDate date, LocalTime startTime, LocalTime endTime, int guests, SeatingType seatingType, ReservationStatus status) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.guests = guests;
        this.seatingType = seatingType;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public int getGuests() { return guests; }
    public void setGuests(int guests) { this.guests = guests; }
    public SeatingType getSeatingType() { return seatingType; }
    public void setSeatingType(SeatingType seatingType) { this.seatingType = seatingType; }
    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }
}
