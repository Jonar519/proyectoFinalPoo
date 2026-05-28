import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_V1 } from '../config/api.config';

export interface OperationStep {
  operationId?: number;
  operationType?: string;
  status?: string;
  operationTime?: string;
}

export interface FlightWorkflowStatus {
  flightId: number;
  flightNumber: string;
  flightStatus: string;
  phase: string;
  scheduledDeparture?: string;
  nextActionAt?: string;
  cargo?: OperationStep | null;
  takeoff?: OperationStep | null;
  landing?: OperationStep | null;
}

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private http = inject(HttpClient);
  private baseUrl = `${API_V1}/flights`;

  getAllWorkflows(): Observable<FlightWorkflowStatus[]> {
    return this.http.get<any>(`${this.baseUrl}/workflows`).pipe(map(res => res.data));
  }

  getWorkflow(flightId: number): Observable<FlightWorkflowStatus> {
    return this.http.get<any>(`${this.baseUrl}/${flightId}/workflow`).pipe(map(res => res.data));
  }

  updatePhase(flightId: number, phase: string): Observable<FlightWorkflowStatus> {
    return this.http.put<any>(`${this.baseUrl}/${flightId}/workflow/phase`, { phase }).pipe(map(res => res.data));
  }

  advance(flightId: number): Observable<FlightWorkflowStatus> {
    return this.http.post<any>(`${this.baseUrl}/${flightId}/workflow/advance`, {}).pipe(map(res => res.data));
  }
}
