package com.aircontrolpro.repository;

import com.aircontrolpro.workflow.FlightWorkflow;
import com.aircontrolpro.workflow.FlightWorkflowPhase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlightWorkflowRepository extends JpaRepository<FlightWorkflow, Long> {
    Optional<FlightWorkflow> findByFlightId(Long flightId);
    List<FlightWorkflow> findByPhaseNot(FlightWorkflowPhase phase);
}
