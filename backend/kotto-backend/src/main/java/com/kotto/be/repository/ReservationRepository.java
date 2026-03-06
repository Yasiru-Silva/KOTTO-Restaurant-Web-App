package com.kotto.be.repository;

import com.kotto.be.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUser_Id(Long userId);

}