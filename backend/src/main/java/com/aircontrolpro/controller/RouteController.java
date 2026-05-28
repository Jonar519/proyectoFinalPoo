package com.aircontrolpro.controller;

import com.aircontrolpro.flights.AirRoute;
import com.aircontrolpro.service.RouteService;
import com.aircontrolpro.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AirRoute>>> getAllRoutes() {
        return ResponseEntity.ok(
            ApiResponse.<List<AirRoute>>builder()
                .success(true)
                .message("Rutas recuperadas")
                .data(routeService.getAllRoutes())
                .timestamp(LocalDateTime.now())
                .build()
        );
    }
}
