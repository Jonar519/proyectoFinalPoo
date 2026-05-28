package com.aircontrolpro.controller;

import com.aircontrolpro.shared.ApiResponse;
import com.aircontrolpro.workflow.FlightWorkflowPhase;
import com.aircontrolpro.workflow.FlightWorkflowService;
import com.aircontrolpro.workflow.dto.FlightWorkflowStatusDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/flights")
public class FlightWorkflowController {

    private final FlightWorkflowService workflowService;

    public FlightWorkflowController(FlightWorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping("/workflows")
    public ResponseEntity<ApiResponse<List<FlightWorkflowStatusDto>>> getAllWorkflows() {
        return ResponseEntity.ok(ApiResponse.<List<FlightWorkflowStatusDto>>builder()
                .success(true)
                .message("Flujos operativos recuperados")
                .data(workflowService.getAllWorkflowStatuses())
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/{id}/workflow")
    public ResponseEntity<ApiResponse<FlightWorkflowStatusDto>> getWorkflow(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<FlightWorkflowStatusDto>builder()
                .success(true)
                .message("Flujo operativo recuperado")
                .data(workflowService.getWorkflowStatus(id))
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PutMapping("/{id}/workflow/phase")
    public ResponseEntity<ApiResponse<FlightWorkflowStatusDto>> updatePhase(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String phaseValue = body.get("phase");
        if (phaseValue == null || phaseValue.isBlank()) {
            throw new IllegalArgumentException("El campo 'phase' es obligatorio");
        }
        FlightWorkflowPhase phase = FlightWorkflowPhase.valueOf(phaseValue);
        return ResponseEntity.ok(ApiResponse.<FlightWorkflowStatusDto>builder()
                .success(true)
                .message("Fase del flujo actualizada")
                .data(workflowService.updatePhaseManually(id, phase))
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PostMapping("/{id}/workflow/advance")
    public ResponseEntity<ApiResponse<FlightWorkflowStatusDto>> advance(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<FlightWorkflowStatusDto>builder()
                .success(true)
                .message("Flujo avanzado manualmente")
                .data(workflowService.advanceManually(id))
                .timestamp(LocalDateTime.now())
                .build());
    }
}
