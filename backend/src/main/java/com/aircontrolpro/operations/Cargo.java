package com.aircontrolpro.operations;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "cargo_operations")
public class Cargo extends AirportOperation {

    private Double totalWeight;
    private Boolean hazardousMaterial;
    private String cargoZone;

    public Cargo() {}

    @Override
    public boolean validateOperation() {
        return totalWeight != null && totalWeight < 50000 && hazardousMaterial != null && !hazardousMaterial;
    }

    @Override
    public String getReportType() {
        return "CARGA";
    }

    public Double getTotalWeight() { return totalWeight; }
    public void setTotalWeight(Double totalWeight) { this.totalWeight = totalWeight; }

    public Boolean getHazardousMaterial() { return hazardousMaterial; }
    public void setHazardousMaterial(Boolean hazardousMaterial) { this.hazardousMaterial = hazardousMaterial; }

    public String getCargoZone() { return cargoZone; }
    public void setCargoZone(String cargoZone) { this.cargoZone = cargoZone; }
}
