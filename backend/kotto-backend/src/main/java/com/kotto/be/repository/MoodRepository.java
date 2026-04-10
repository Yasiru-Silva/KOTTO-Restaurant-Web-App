package com.kotto.be.repository;

import com.kotto.be.model.Mood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MoodRepository extends JpaRepository<Mood, Long> {
    boolean existsByNameIgnoreCase(String name);

    Optional<Mood> findByNameIgnoreCase(String name);
}
