package com.aircontrolpro.operations;

import com.aircontrolpro.shared.Monitorable;
import com.aircontrolpro.shared.Reportable;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "operations")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "operationType")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Takeoff.class, name = "TAKEOFF"),
        @JsonSubTypes.Type(value = Landing.class, name = "LANDING"),
        @JsonSubTypes.Type(value = Boarding.class, name = "BOARDING"),
        @JsonSubTypes.Type(value = Cargo.class, name = "CARGO")
})
public abstract class AirportOperation implements Monitorable, Reportable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime operationTime;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String flightNumber;

    protected AirportOperation() {}

    public abstract boolean validateOperation();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getOperationTime() { return operationTime; }
    public void setOperationTime(LocalDateTime operationTime) { this.operationTime = operationTime; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    @Override
    public String getStatus() {
        return status;
    }

    @Override
    public void updateStatus(String newStatus) {
        this.status = newStatus;
    }

    @Override
    public Map<String, Object> generateReportData() {
        return Map.of(
            "id", id,
            "time", operationTime,
            "status", status,
            "flight", flightNumber,
            "type", getReportType()
        );
    }
}
