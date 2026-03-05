package com.kotto.be.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class LogoutController {

    @GetMapping("/logout")
    public void logout(HttpServletResponse response) throws IOException {
        response.sendRedirect("http://localhost:5173/logout");
    }
}