package com.kotto.be.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(nullable = false)
    private double price;

    private String imageUrl;

    private boolean bestSeller;

    // Example for mood tags (Hungry, Relaxed, etc.)
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> moods;
}