package com.aircontrolpro.flights;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "air_routes")
public class AirRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String origin;
    private String destination;
    private Double distance;

    @ManyToOne
    @JoinColumn(name = "parent_route_id")
    @JsonIgnore
    private AirRoute parentRoute;

    @OneToMany(mappedBy = "parentRoute", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AirRoute> subRoutes = new ArrayList<>();

    public AirRoute() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    public AirRoute getParentRoute() { return parentRoute; }
    public void setParentRoute(AirRoute parentRoute) { this.parentRoute = parentRoute; }

    public List<AirRoute> getSubRoutes() { return subRoutes; }
    public void setSubRoutes(List<AirRoute> subRoutes) { this.subRoutes = subRoutes; }

    // Recursividad: calcular distancia total de la ruta incluyendo subrutas
    public Double calculateTotalDistance() {
        Double total = this.distance != null ? this.distance : 0.0;
        for (AirRoute sub : subRoutes) {
            total += sub.calculateTotalDistance();
        }
        return total;
    }
}
