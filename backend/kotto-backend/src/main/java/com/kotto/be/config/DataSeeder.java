package com.kotto.be.config;

import com.kotto.be.model.MenuItem;
import com.kotto.be.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final MenuRepository menuRepository;

    @Override
    public void run(String... args) {
        seedMenuItems();
    }

    private void seedMenuItems() {

        if (menuRepository.count() > 0) {
            log.info("Menu items already exist. Skipping seed.");
            return;
        }

        MenuItem item1 = new MenuItem();
        item1.setName("KOTTO Classic Burger");
        item1.setDescription("Juicy grilled burger with house sauce");
        item1.setPrice(750);

        MenuItem item2 = new MenuItem();
        item2.setName("Spicy Chicken Wrap");
        item2.setDescription("Crispy chicken with spicy mayo wrap");
        item2.setPrice(650);

        MenuItem item3 = new MenuItem();
        item3.setName("Seafood Fried Rice");
        item3.setDescription("Fried rice with prawns and squid");
        item3.setPrice(900);

        menuRepository.save(item1);
        menuRepository.save(item2);
        menuRepository.save(item3);

        log.info("Sample menu items seeded successfully.");
    }
}