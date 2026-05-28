package com.aircontrolpro.workflow;

import com.aircontrolpro.flights.Flight;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "flight_workflows")
public class FlightWorkflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "flight_id", unique = true, nullable = false)
    private Flight flight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlightWorkflowPhase phase;

    @Column(name = "next_action_at")
    private LocalDateTime nextActionAt;

    @Column(name = "cargo_operation_id")
    private Long cargoOperationId;

    @Column(name = "takeoff_operation_id")
    private Long takeoffOperationId;

    @Column(name = "landing_operation_id")
    private Long landingOperationId;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public FlightWorkflow() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Flight getFlight() { return flight; }
    public void setFlight(Flight flight) { this.flight = flight; }

    public FlightWorkflowPhase getPhase() { return phase; }
    public void setPhase(FlightWorkflowPhase phase) { this.phase = phase; }

    public LocalDateTime getNextActionAt() { return nextActionAt; }
    public void setNextActionAt(LocalDateTime nextActionAt) { this.nextActionAt = nextActionAt; }

    public Long getCargoOperationId() { return cargoOperationId; }
    public void setCargoOperationId(Long cargoOperationId) { this.cargoOperationId = cargoOperationId; }

    public Long getTakeoffOperationId() { return takeoffOperationId; }
    public void setTakeoffOperationId(Long takeoffOperationId) { this.takeoffOperationId = takeoffOperationId; }

    public Long getLandingOperationId() { return landingOperationId; }
    public void setLandingOperationId(Long landingOperationId) { this.landingOperationId = landingOperationId; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
