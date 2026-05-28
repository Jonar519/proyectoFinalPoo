package com.aircontrolpro.service;

import com.aircontrolpro.flights.AirRoute;
import com.aircontrolpro.repository.AirRouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private final AirRouteRepository airRouteRepository;

    public RouteService(AirRouteRepository airRouteRepository) {
        this.airRouteRepository = airRouteRepository;
    }

    public List<AirRoute> getAllRoutes() {
        return airRouteRepository.findAll();
    }
}
