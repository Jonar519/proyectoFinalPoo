package com.aircontrolpro.repository;

import com.aircontrolpro.flights.AirRoute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AirRouteRepository extends JpaRepository<AirRoute, Long> {
}
