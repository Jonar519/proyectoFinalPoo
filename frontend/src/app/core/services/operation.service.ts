import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/operations';

  getOperations(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(map(res => res.data));
  }

  processTakeoff(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/takeoff`, data);
  }

  processLanding(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/landing`, data);
  }

  processCargo(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cargo`, data);
  }

  updateOperationStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  getOperationsByFlight(flightNumber: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/flight/${flightNumber}`).pipe(map(res => res.data));
  }
}
