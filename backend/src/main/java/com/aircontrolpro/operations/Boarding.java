package com.aircontrolpro.operations;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "boardings")
public class Boarding extends AirportOperation {

    private Integer passengerCount;
    private Integer gateNumber;
    private Boolean crewReady;

    public Boarding() {}

    @Override
    public boolean validateOperation() {
        return passengerCount != null && passengerCount > 0 && crewReady != null && crewReady;
    }

    @Override
    public String getReportType() {
        return "EMBARQUE";
    }

    public Integer getPassengerCount() { return passengerCount; }
    public void setPassengerCount(Integer passengerCount) { this.passengerCount = passengerCount; }

    public Integer getGateNumber() { return gateNumber; }
    public void setGateNumber(Integer gateNumber) { this.gateNumber = gateNumber; }

    public Boolean getCrewReady() { return crewReady; }
    public void setCrewReady(Boolean crewReady) { this.crewReady = crewReady; }
}
