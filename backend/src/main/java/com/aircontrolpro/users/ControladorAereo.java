package com.aircontrolpro.users;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CONTROLADOR")
public class ControladorAereo extends User {
    private String licenseNumber;
    private Integer yearsExperience;

    public ControladorAereo() {}

    public ControladorAereo(String username, String password, String email, String licenseNumber) {
        this.setUsername(username);
        this.setPassword(password);
        this.setEmail(email);
        this.setRole(UserRole.CONTROLADOR);
        this.licenseNumber = licenseNumber;
    }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public Integer getYearsExperience() { return yearsExperience; }
    public void setYearsExperience(Integer yearsExperience) { this.yearsExperience = yearsExperience; }
}
