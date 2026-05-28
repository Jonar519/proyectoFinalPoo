package com.aircontrolpro.operations;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "takeoffs")
public class Takeoff extends AirportOperation {

    private String runwayId;
    private Double windSpeed;
    private Double visibility;

    public Takeoff() {}

    @Override
    public boolean validateOperation() {
        return visibility != null && visibility > 500 && windSpeed != null && windSpeed < 50;
    }

    @Override
    public String getReportType() {
        return "DESPEGUE";
    }

    public String getRunwayId() { return runwayId; }
    public void setRunwayId(String runwayId) { this.runwayId = runwayId; }

    public Double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(Double windSpeed) { this.windSpeed = windSpeed; }

    public Double getVisibility() { return visibility; }
    public void setVisibility(Double visibility) { this.visibility = visibility; }
}
