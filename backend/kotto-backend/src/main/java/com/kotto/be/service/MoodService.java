package com.kotto.be.service;

import com.kotto.be.dto.MoodDTO;
import com.kotto.be.model.Mood;
import com.kotto.be.repository.MoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoodService {

    private final MoodRepository moodRepository;

    public List<MoodDTO> getAll() {
        return moodRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(m -> new MoodDTO(m.getId(), m.getName()))
                .collect(Collectors.toList());
    }

    @Transactional
    public MoodDTO create(String name) {
        String trimmed = name == null ? "" : name.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("Mood name is required");
        }
        if (moodRepository.existsByNameIgnoreCase(trimmed)) {
            throw new IllegalArgumentException("Mood already exists");
        }
        Mood m = new Mood();
        m.setName(trimmed);
        m = moodRepository.save(m);
        return new MoodDTO(m.getId(), m.getName());
    }
}
