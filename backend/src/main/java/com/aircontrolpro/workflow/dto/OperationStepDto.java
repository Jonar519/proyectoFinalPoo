package com.aircontrolpro.workflow.dto;

import java.time.LocalDateTime;

public class OperationStepDto {
    private Long operationId;
    private String operationType;
    private String status;
    private LocalDateTime operationTime;

    public OperationStepDto() {}

    public OperationStepDto(Long operationId, String operationType, String status, LocalDateTime operationTime) {
        this.operationId = operationId;
        this.operationType = operationType;
        this.status = status;
        this.operationTime = operationTime;
    }

    public Long getOperationId() { return operationId; }
    public void setOperationId(Long operationId) { this.operationId = operationId; }

    public String getOperationType() { return operationType; }
    public void setOperationType(String operationType) { this.operationType = operationType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getOperationTime() { return operationTime; }
    public void setOperationTime(LocalDateTime operationTime) { this.operationTime = operationTime; }
}
