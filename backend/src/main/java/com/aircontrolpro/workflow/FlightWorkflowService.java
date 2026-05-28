package com.aircontrolpro.workflow;

import com.aircontrolpro.flights.Flight;
import com.aircontrolpro.flights.FlightStatus;
import com.aircontrolpro.operations.*;
import com.aircontrolpro.repository.AirportOperationRepository;
import com.aircontrolpro.repository.FlightRepository;
import com.aircontrolpro.repository.FlightWorkflowRepository;
import com.aircontrolpro.workflow.dto.FlightWorkflowStatusDto;
import com.aircontrolpro.workflow.dto.OperationStepDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlightWorkflowService {

    private static final Logger log = LoggerFactory.getLogger(FlightWorkflowService.class);

    private final FlightWorkflowRepository workflowRepository;
    private final FlightRepository flightRepository;
    private final AirportOperationRepository operationRepository;

    @Value("${aircontrol.workflow.simulation-minutes:10}")
    private int simulationMinutes;

    public FlightWorkflowService(
            FlightWorkflowRepository workflowRepository,
            FlightRepository flightRepository,
            AirportOperationRepository operationRepository) {
        this.workflowRepository = workflowRepository;
        this.flightRepository = flightRepository;
        this.operationRepository = operationRepository;
    }

    @Transactional
    public FlightWorkflow initializeForFlight(Flight flight) {
        FlightWorkflow workflow = new FlightWorkflow();
        workflow.setFlight(flight);
        workflow.setPhase(FlightWorkflowPhase.WAITING_SCHEDULE);
        workflow.setUpdatedAt(LocalDateTime.now());
        if (flight.getStatus() == null) {
            flight.setStatus(FlightStatus.SCHEDULED);
        }
        return workflowRepository.save(workflow);
    }

    @Transactional(readOnly = true)
    public List<FlightWorkflowStatusDto> getAllWorkflowStatuses() {
        return workflowRepository.findAll().stream()
                .map(this::toStatusDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public FlightWorkflowStatusDto getWorkflowStatus(Long flightId) {
        FlightWorkflow workflow = workflowRepository.findByFlightId(flightId)
                .orElseThrow(() -> new IllegalArgumentException("Flujo no encontrado para el vuelo: " + flightId));
        return toStatusDto(workflow);
    }

    @Transactional
    public FlightWorkflowStatusDto updatePhaseManually(Long flightId, FlightWorkflowPhase newPhase) {
        FlightWorkflow workflow = workflowRepository.findByFlightId(flightId)
                .orElseThrow(() -> new IllegalArgumentException("Flujo no encontrado para el vuelo: " + flightId));
        Flight flight = workflow.getFlight();

        switch (newPhase) {
            case WAITING_SCHEDULE -> {
                workflow.setPhase(FlightWorkflowPhase.WAITING_SCHEDULE);
                workflow.setNextActionAt(null);
                flight.setStatus(FlightStatus.SCHEDULED);
            }
            case CARGO_IN_PROGRESS -> startCargo(workflow, flight);
            case TAKEOFF_IN_PROGRESS -> {
                ensureCargoCompleted(workflow, flight);
                startTakeoff(workflow, flight);
            }
            case IN_FLIGHT -> {
                ensureTakeoffCompleted(workflow, flight);
                flight.setStatus(FlightStatus.IN_FLIGHT);
                workflow.setPhase(FlightWorkflowPhase.IN_FLIGHT);
                workflow.setNextActionAt(LocalDateTime.now().plusMinutes(simulationMinutes));
            }
            case LANDING_IN_PROGRESS -> startLanding(workflow, flight);
            case COMPLETED -> completeLanding(workflow, flight);
        }

        workflow.setUpdatedAt(LocalDateTime.now());
        flightRepository.save(flight);
        workflowRepository.save(workflow);
        return toStatusDto(workflow);
    }

    @Transactional
    public void processDueWorkflows() {
        LocalDateTime now = LocalDateTime.now();
        List<FlightWorkflow> active = workflowRepository.findByPhaseNot(FlightWorkflowPhase.COMPLETED);
        for (FlightWorkflow workflow : active) {
            try {
                advanceIfDue(workflow, now);
            } catch (Exception ex) {
                log.error("Error avanzando flujo del vuelo {}: {}",
                        workflow.getFlight().getFlightNumber(), ex.getMessage());
            }
        }
    }

    @Transactional
    public FlightWorkflowStatusDto advanceManually(Long flightId) {
        FlightWorkflow workflow = workflowRepository.findByFlightId(flightId)
                .orElseThrow(() -> new IllegalArgumentException("Flujo no encontrado"));
        advanceIfDue(workflow, LocalDateTime.now());
        return toStatusDto(workflow);
    }

    private void advanceIfDue(FlightWorkflow workflow, LocalDateTime now) {
        Flight flight = workflow.getFlight();
        if (flight.getStatus() == FlightStatus.CANCELLED) {
            return;
        }

        switch (workflow.getPhase()) {
            case WAITING_SCHEDULE -> {
                if (flight.getScheduledDeparture() != null
                        && !flight.getScheduledDeparture().isAfter(now)) {
                    startCargo(workflow, flight);
                }
            }
            case CARGO_IN_PROGRESS -> completeCargoAndStartTakeoff(workflow, flight);
            case TAKEOFF_IN_PROGRESS -> completeTakeoffAndStartInFlight(workflow, flight);
            case IN_FLIGHT -> {
                if (workflow.getNextActionAt() != null && !workflow.getNextActionAt().isAfter(now)) {
                    startLanding(workflow, flight);
                }
            }
            case LANDING_IN_PROGRESS -> completeLanding(workflow, flight);
            default -> { /* COMPLETED */ }
        }
        workflow.setUpdatedAt(LocalDateTime.now());
        workflowRepository.save(workflow);
        flightRepository.save(flight);
    }

    private void startCargo(FlightWorkflow workflow, Flight flight) {
        Cargo cargo = new Cargo();
        cargo.setFlightNumber(flight.getFlightNumber());
        cargo.setOperationTime(LocalDateTime.now());
        cargo.setTotalWeight(12000.0);
        cargo.setHazardousMaterial(false);
        cargo.setCargoZone("ZONA-A");
        cargo.updateStatus("IN_PROGRESS");
        operationRepository.save(cargo);

        workflow.setCargoOperationId(cargo.getId());
        workflow.setPhase(FlightWorkflowPhase.CARGO_IN_PROGRESS);
        flight.setStatus(FlightStatus.BOARDING);
    }

    private void completeCargoAndStartTakeoff(FlightWorkflow workflow, Flight flight) {
        completeOperation(workflow.getCargoOperationId());
        startTakeoff(workflow, flight);
    }

    private void startTakeoff(FlightWorkflow workflow, Flight flight) {
        Takeoff takeoff = new Takeoff();
        takeoff.setFlightNumber(flight.getFlightNumber());
        takeoff.setOperationTime(LocalDateTime.now());
        takeoff.setRunwayId("09L");
        takeoff.setWindSpeed(12.0);
        takeoff.setVisibility(8000.0);
        takeoff.updateStatus("IN_PROGRESS");
        operationRepository.save(takeoff);

        workflow.setTakeoffOperationId(takeoff.getId());
        workflow.setPhase(FlightWorkflowPhase.TAKEOFF_IN_PROGRESS);
        flight.setStatus(FlightStatus.DEPARTED);
    }

    private void completeTakeoffAndStartInFlight(FlightWorkflow workflow, Flight flight) {
        completeOperation(workflow.getTakeoffOperationId());
        flight.setStatus(FlightStatus.IN_FLIGHT);
        workflow.setPhase(FlightWorkflowPhase.IN_FLIGHT);
        workflow.setNextActionAt(LocalDateTime.now().plusMinutes(simulationMinutes));
    }

    private void startLanding(FlightWorkflow workflow, Flight flight) {
        Landing landing = new Landing();
        landing.setFlightNumber(flight.getFlightNumber());
        landing.setOperationTime(LocalDateTime.now());
        landing.setApproachPath("ILS-27");
        landing.setFuelEmergency(false);
        landing.updateStatus("IN_PROGRESS");
        operationRepository.save(landing);

        workflow.setLandingOperationId(landing.getId());
        workflow.setPhase(FlightWorkflowPhase.LANDING_IN_PROGRESS);
    }

    private void completeLanding(FlightWorkflow workflow, Flight flight) {
        completeOperation(workflow.getLandingOperationId());
        flight.setStatus(FlightStatus.LANDED);
        workflow.setPhase(FlightWorkflowPhase.COMPLETED);
        workflow.setNextActionAt(null);
    }

    private void completeOperation(Long operationId) {
        if (operationId == null) {
            return;
        }
        AirportOperation operation = operationRepository.findById(operationId)
                .orElseThrow(() -> new IllegalArgumentException("Operación no encontrada: " + operationId));
        if (operation.validateOperation()) {
            operation.updateStatus("COMPLETED");
        } else {
            operation.updateStatus("FAILED");
        }
        operationRepository.save(operation);
    }

    private void ensureCargoCompleted(FlightWorkflow workflow, Flight flight) {
        if (workflow.getCargoOperationId() == null) {
            startCargo(workflow, flight);
        }
        completeOperation(workflow.getCargoOperationId());
    }

    private void ensureTakeoffCompleted(FlightWorkflow workflow, Flight flight) {
        if (workflow.getTakeoffOperationId() == null) {
            startTakeoff(workflow, flight);
        }
        completeOperation(workflow.getTakeoffOperationId());
    }

    private FlightWorkflowStatusDto toStatusDto(FlightWorkflow workflow) {
        Flight flight = workflow.getFlight();
        FlightWorkflowStatusDto dto = new FlightWorkflowStatusDto();
        dto.setFlightId(flight.getId());
        dto.setFlightNumber(flight.getFlightNumber());
        dto.setFlightStatus(flight.getStatus());
        dto.setPhase(workflow.getPhase());
        dto.setScheduledDeparture(flight.getScheduledDeparture());
        dto.setNextActionAt(workflow.getNextActionAt());
        dto.setCargo(loadStep(workflow.getCargoOperationId(), "CARGO"));
        dto.setTakeoff(loadStep(workflow.getTakeoffOperationId(), "TAKEOFF"));
        dto.setLanding(loadStep(workflow.getLandingOperationId(), "LANDING"));
        return dto;
    }

    private OperationStepDto loadStep(Long operationId, String type) {
        if (operationId == null) {
            return null;
        }
        return operationRepository.findById(operationId)
                .map(op -> new OperationStepDto(op.getId(), type, op.getStatus(), op.getOperationTime()))
                .orElse(null);
    }
}
