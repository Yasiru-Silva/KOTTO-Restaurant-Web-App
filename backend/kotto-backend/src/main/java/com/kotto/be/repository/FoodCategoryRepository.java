package com.kotto.be.repository;

import com.kotto.be.model.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Long> {
    boolean existsByNameIgnoreCase(String name);

    Optional<FoodCategory> findByNameIgnoreCase(String name);
}
