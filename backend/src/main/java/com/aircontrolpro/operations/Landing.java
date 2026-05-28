package com.aircontrolpro.operations;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "landings")
public class Landing extends AirportOperation {

    private String approachPath;
    private Boolean fuelEmergency;

    public Landing() {}

    @Override
    public boolean validateOperation() {
        return fuelEmergency != null && !fuelEmergency && approachPath != null;
    }

    @Override
    public String getReportType() {
        return "ATERRIZAJE";
    }

    public String getApproachPath() { return approachPath; }
    public void setApproachPath(String approachPath) { this.approachPath = approachPath; }

    public Boolean getFuelEmergency() { return fuelEmergency; }
    public void setFuelEmergency(Boolean fuelEmergency) { this.fuelEmergency = fuelEmergency; }
}
