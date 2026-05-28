package com.aircontrolpro.repository;

import com.aircontrolpro.operations.AirportOperation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AirportOperationRepository extends JpaRepository<AirportOperation, Long> {
    List<AirportOperation> findByFlightNumberOrderByOperationTimeDesc(String flightNumber);
}
