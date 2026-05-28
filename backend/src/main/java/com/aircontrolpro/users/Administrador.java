package com.aircontrolpro.users;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Administrador extends User {
    private String department;
    
    public Administrador() {}

    public Administrador(String username, String password, String email, String department) {
        this.setUsername(username);
        this.setPassword(password);
        this.setEmail(email);
        this.setRole(UserRole.ADMIN);
        this.department = department;
    }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
