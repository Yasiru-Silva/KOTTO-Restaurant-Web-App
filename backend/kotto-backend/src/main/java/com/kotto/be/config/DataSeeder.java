package com.kotto.be.config;

import com.kotto.be.model.FoodCategory;
import com.kotto.be.model.MenuItem;
import com.kotto.be.model.Mood;
import com.kotto.be.repository.FoodCategoryRepository;
import com.kotto.be.repository.MenuRepository;
import com.kotto.be.repository.MoodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final MenuRepository menuRepository;
    private final FoodCategoryRepository foodCategoryRepository;
    private final MoodRepository moodRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedCategories();
        seedMoods();
        seedMenuItems();
    }

    private void seedCategories() {
        if (foodCategoryRepository.count() > 0) {
            return;
        }
        String[] names = {"Kottu", "Wraps", "Burgers", "Rice & Noodles"};
        for (int i = 0; i < names.length; i++) {
            FoodCategory c = new FoodCategory();
            c.setName(names[i]);
            c.setSortOrder(i);
            foodCategoryRepository.save(c);
        }
        log.info("Food categories seeded.");
    }

    private void seedMoods() {
        if (moodRepository.count() > 0) {
            return;
        }
        String[] names = {"Relaxed", "Hungry", "In a Hurry", "Budget"};
        for (String name : names) {
            Mood m = new Mood();
            m.setName(name);
            moodRepository.save(m);
        }
        log.info("Moods seeded.");
    }

    private void seedMenuItems() {
        if (menuRepository.count() > 0) {
            log.info("Menu items already exist. Skipping menu seed.");
            return;
        }

        FoodCategory burgers = foodCategoryRepository.findByNameIgnoreCase("Burgers").orElse(null);
        FoodCategory wraps = foodCategoryRepository.findByNameIgnoreCase("Wraps").orElse(null);
        FoodCategory rice = foodCategoryRepository.findByNameIgnoreCase("Rice & Noodles").orElse(null);

        List<Mood> allMoods = moodRepository.findAll();
        Set<Mood> hungryBudget = new HashSet<>();
        Set<Mood> relaxed = new HashSet<>();
        for (Mood m : allMoods) {
            if ("Hungry".equalsIgnoreCase(m.getName()) || "Budget".equalsIgnoreCase(m.getName())) {
                hungryBudget.add(m);
            }
            if ("Relaxed".equalsIgnoreCase(m.getName())) {
                relaxed.add(m);
            }
        }
        if (hungryBudget.isEmpty()) {
            hungryBudget.addAll(allMoods);
        }
        if (relaxed.isEmpty() && !allMoods.isEmpty()) {
            relaxed.add(allMoods.get(0));
        }

        MenuItem item1 = new MenuItem();
        item1.setName("KOTTO Classic Burger");
        item1.setDescription("Juicy grilled burger with house sauce");
        item1.setPrice(750);
        item1.setBestSeller(true);
        item1.setCategory(burgers);
        item1.setMoods(new HashSet<>(hungryBudget));

        MenuItem item2 = new MenuItem();
        item2.setName("Spicy Chicken Wrap");
        item2.setDescription("Crispy chicken with spicy mayo wrap");
        item2.setPrice(650);
        item2.setCategory(wraps);
        item2.setMoods(new HashSet<>(hungryBudget));

        MenuItem item3 = new MenuItem();
        item3.setName("Seafood Fried Rice");
        item3.setDescription("Fried rice with prawns and squid");
        item3.setPrice(900);
        item3.setCategory(rice);
        item3.setMoods(new HashSet<>(relaxed));

        menuRepository.save(item1);
        menuRepository.save(item2);
        menuRepository.save(item3);

        log.info("Sample menu items seeded successfully.");
    }
}
