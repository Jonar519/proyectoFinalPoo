package com.aircontrolpro.controller;

import com.aircontrolpro.service.MenuService;
import com.aircontrolpro.shared.ApiResponse;
import com.aircontrolpro.shared.MenuItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItem>>> getMenu() {
        return ResponseEntity.ok(
            ApiResponse.<List<MenuItem>>builder()
                .success(true)
                .message("Menú recuperado exitosamente")
                .data(menuService.getMainMenu())
                .timestamp(LocalDateTime.now())
                .build()
        );
    }
}
