package com.aircontrolpro.controller;

import com.aircontrolpro.operations.*;
import com.aircontrolpro.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/operations")
public class OperationController {

    private final OperationService operationService;

    public OperationController(OperationService operationService) {
        this.operationService = operationService;
    }

    @GetMapping("/flight/{flightNumber}")
    public ResponseEntity<ApiResponse<List<AirportOperation>>> getByFlight(@PathVariable String flightNumber) {
        return ResponseEntity.ok(
            ApiResponse.<List<AirportOperation>>builder()
                .success(true)
                .message("Operaciones del vuelo recuperadas")
                .data(operationService.getOperationsByFlightNumber(flightNumber))
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AirportOperation>> updateStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("El campo 'status' es obligatorio");
        }
        AirportOperation updated = operationService.updateOperationStatus(id, status);
        return ResponseEntity.ok(
            ApiResponse.<AirportOperation>builder()
                .success(true)
                .message("Estado de operación actualizado")
                .data(updated)
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AirportOperation>>> getAllOperations() {
        return ResponseEntity.ok(
            ApiResponse.<List<AirportOperation>>builder()
                .success(true)
                .message("Operaciones recuperadas")
                .data(operationService.getAllOperations())
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    @PostMapping("/takeoff")
    public ResponseEntity<ApiResponse<Boolean>> processTakeoff(@RequestBody Takeoff operation) {
        operation.setOperationTime(LocalDateTime.now());
        boolean success = operationService.processOperation(operation);
        return ResponseEntity.ok(
            ApiResponse.<Boolean>builder()
                .success(success)
                .message(success ? "Despegue autorizado y procesado" : "Despegue rechazado: No cumple condiciones mínimas")
                .data(success)
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    @PostMapping("/landing")
    public ResponseEntity<ApiResponse<Boolean>> processLanding(@RequestBody Landing operation) {
        operation.setOperationTime(LocalDateTime.now());
        boolean success = operationService.processOperation(operation);
        return ResponseEntity.ok(
            ApiResponse.<Boolean>builder()
                .success(success)
                .message(success ? "Aterrizaje procesado exitosamente" : "Fallo en validación de aterrizaje")
                .data(success)
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    @PostMapping("/cargo")
    public ResponseEntity<ApiResponse<Boolean>> processCargo(@RequestBody Cargo operation) {
        operation.setOperationTime(LocalDateTime.now());
        boolean success = operationService.processOperation(operation);
        return ResponseEntity.ok(
            ApiResponse.<Boolean>builder()
                .success(success)
                .message(success ? "Carga registrada correctamente" : "Exceso de peso o materiales no permitidos")
                .data(success)
                .timestamp(LocalDateTime.now())
                .build()
        );
    }
}
