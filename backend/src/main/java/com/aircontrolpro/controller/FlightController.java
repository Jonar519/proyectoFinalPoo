package com.aircontrolpro.controller;

import com.aircontrolpro.flights.Flight;
import com.aircontrolpro.service.FlightService;
import com.aircontrolpro.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Flight>>> getAllFlights() {
        return ResponseEntity.ok(
            ApiResponse.<List<Flight>>builder()
                .success(true)
                .message("Vuelos recuperados exitosamente")
                .data(flightService.getAllFlights())
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Flight>> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.<Flight>builder()
                .success(true)
                .message("Vuelo recuperado exitosamente")
                .data(flightService.getFlightById(id))
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Flight>> createFlight(@RequestBody Flight flight) {
        return ResponseEntity.ok(
            ApiResponse.<Flight>builder()
                .success(true)
                .message("Vuelo creado exitosamente")
                .data(flightService.saveFlight(flight))
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Flight>> updateFlight(@PathVariable Long id, @RequestBody Flight flight) {
        return ResponseEntity.ok(
            ApiResponse.<Flight>builder()
                .success(true)
                .message("Vuelo actualizado exitosamente")
                .data(flightService.updateFlight(id, flight))
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.ok(
            ApiResponse.<Void>builder()
                .success(true)
                .message("Vuelo eliminado exitosamente")
                .timestamp(LocalDateTime.now())
                .build()
        );
    }
}
