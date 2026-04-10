package com.kotto.be.controller;

import com.kotto.be.dto.MoodDTO;
import com.kotto.be.service.MoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moods")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MoodController {

    private final MoodService moodService;

    @GetMapping
    public ResponseEntity<List<MoodDTO>> list() {
        return ResponseEntity.ok(moodService.getAll());
    }
}
