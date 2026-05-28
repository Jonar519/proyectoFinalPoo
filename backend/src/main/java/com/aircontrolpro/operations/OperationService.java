package com.aircontrolpro.operations;

import com.aircontrolpro.repository.AirportOperationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperationService {

    private final AirportOperationRepository operationRepository;

    public OperationService(AirportOperationRepository operationRepository) {
        this.operationRepository = operationRepository;
    }

    public boolean processOperation(AirportOperation operation) {
        if (operation.validateOperation()) {
            operation.updateStatus("COMPLETED");
            operationRepository.save(operation);
            return true;
        } else {
            operation.updateStatus("FAILED");
            operationRepository.save(operation);
            return false;
        }
    }

    public List<AirportOperation> getAllOperations() {
        return operationRepository.findAll();
    }

    public AirportOperation getOperationById(Long id) {
        return operationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Operación no encontrada: " + id));
    }

    public List<AirportOperation> getOperationsByFlightNumber(String flightNumber) {
        return operationRepository.findByFlightNumberOrderByOperationTimeDesc(flightNumber);
    }

    public AirportOperation updateOperationStatus(Long id, String newStatus) {
        AirportOperation operation = getOperationById(id);
        operation.updateStatus(newStatus);
        return operationRepository.save(operation);
    }
}
