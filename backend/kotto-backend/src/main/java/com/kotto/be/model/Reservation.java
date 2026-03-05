package com.kotto.be.model;

import com.kotto.be.model.enums.ReservationStatus;
import com.kotto.be.model.enums.SeatingType;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reservation belongs to logged-in user
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Snapshot fields (what user typed)
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 10)
    private String phone;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private int guests;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatingType seatingType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    public Reservation() {}

    // getters/setters...

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public LocalDate getDate() { return date; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public int getGuests() { return guests; }
    public SeatingType getSeatingType() { return seatingType; }
    public ReservationStatus getStatus() { return status; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public void setGuests(int guests) { this.guests = guests; }
    public void setSeatingType(SeatingType seatingType) { this.seatingType = seatingType; }
    public void setStatus(ReservationStatus status) { this.status = status; }
}