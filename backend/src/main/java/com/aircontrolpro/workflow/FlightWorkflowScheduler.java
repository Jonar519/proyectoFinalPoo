package com.aircontrolpro.workflow;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class FlightWorkflowScheduler {

    private final FlightWorkflowService workflowService;

    public FlightWorkflowScheduler(FlightWorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @Scheduled(fixedRate = 15000)
    public void processWorkflows() {
        workflowService.processDueWorkflows();
    }
}
