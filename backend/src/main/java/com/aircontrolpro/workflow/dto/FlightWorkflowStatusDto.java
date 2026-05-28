package com.aircontrolpro.workflow.dto;

import com.aircontrolpro.flights.FlightStatus;
import com.aircontrolpro.workflow.FlightWorkflowPhase;

import java.time.LocalDateTime;

public class FlightWorkflowStatusDto {
    private Long flightId;
    private String flightNumber;
    private FlightStatus flightStatus;
    private FlightWorkflowPhase phase;
    private LocalDateTime scheduledDeparture;
    private LocalDateTime nextActionAt;
    private OperationStepDto cargo;
    private OperationStepDto takeoff;
    private OperationStepDto landing;

    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public FlightStatus getFlightStatus() { return flightStatus; }
    public void setFlightStatus(FlightStatus flightStatus) { this.flightStatus = flightStatus; }

    public FlightWorkflowPhase getPhase() { return phase; }
    public void setPhase(FlightWorkflowPhase phase) { this.phase = phase; }

    public LocalDateTime getScheduledDeparture() { return scheduledDeparture; }
    public void setScheduledDeparture(LocalDateTime scheduledDeparture) { this.scheduledDeparture = scheduledDeparture; }

    public LocalDateTime getNextActionAt() { return nextActionAt; }
    public void setNextActionAt(LocalDateTime nextActionAt) { this.nextActionAt = nextActionAt; }

    public OperationStepDto getCargo() { return cargo; }
    public void setCargo(OperationStepDto cargo) { this.cargo = cargo; }

    public OperationStepDto getTakeoff() { return takeoff; }
    public void setTakeoff(OperationStepDto takeoff) { this.takeoff = takeoff; }

    public OperationStepDto getLanding() { return landing; }
    public void setLanding(OperationStepDto landing) { this.landing = landing; }
}
