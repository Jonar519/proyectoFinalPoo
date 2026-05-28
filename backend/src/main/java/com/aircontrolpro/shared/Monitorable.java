package com.aircontrolpro.shared;

public interface Monitorable {
    String getStatus();
    void updateStatus(String newStatus);
}
