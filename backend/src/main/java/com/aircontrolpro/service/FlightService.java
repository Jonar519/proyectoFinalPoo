package com.aircontrolpro.service;

import com.aircontrolpro.flights.Flight;
import com.aircontrolpro.flights.FlightStatus;
import com.aircontrolpro.repository.FlightRepository;
import com.aircontrolpro.workflow.FlightWorkflowService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FlightService {
    private final FlightRepository flightRepository;
    private final FlightWorkflowService workflowService;

    public FlightService(FlightRepository flightRepository, FlightWorkflowService workflowService) {
        this.flightRepository = flightRepository;
        this.workflowService = workflowService;
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vuelo no encontrado con id: " + id));
    }

    @Transactional
    public Flight saveFlight(Flight flight) {
        if (flight.getStatus() == null) {
            flight.setStatus(FlightStatus.SCHEDULED);
        }
        Flight saved = flightRepository.save(flight);
        workflowService.initializeForFlight(saved);
        return saved;
    }

    @Transactional
    public Flight updateFlight(Long id, Flight updatedFlight) {
        Flight existing = getFlightById(id);
        existing.setFlightNumber(updatedFlight.getFlightNumber());
        existing.setAirline(updatedFlight.getAirline());
        existing.setAircraftType(updatedFlight.getAircraftType());
        existing.setRoute(updatedFlight.getRoute());
        existing.setScheduledDeparture(updatedFlight.getScheduledDeparture());
        existing.setScheduledArrival(updatedFlight.getScheduledArrival());
        existing.setStatus(updatedFlight.getStatus());
        return flightRepository.save(existing);
    }

    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new IllegalArgumentException("Vuelo no encontrado con id: " + id);
        }
        flightRepository.deleteById(id);
    }
}
