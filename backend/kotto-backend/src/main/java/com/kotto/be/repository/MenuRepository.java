package com.kotto.be.repository;

import com.kotto.be.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<MenuItem, Long> {
    boolean existsByName(String name);

    Optional<MenuItem> findByName(String name);

    @Query("SELECT DISTINCT m FROM MenuItem m LEFT JOIN FETCH m.category LEFT JOIN FETCH m.moods")
    List<MenuItem> findAllWithRelations();

    @Query("SELECT DISTINCT m FROM MenuItem m LEFT JOIN FETCH m.category LEFT JOIN FETCH m.moods WHERE m.id = :id")
    Optional<MenuItem> findByIdWithRelations(@Param("id") Long id);
}