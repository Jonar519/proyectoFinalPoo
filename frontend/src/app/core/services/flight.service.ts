import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Flight {
  id?: number;
  flightNumber: string;
  airline: string;
  aircraftType: string;
  route: any;
  scheduledDeparture: string;
  scheduledArrival: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/flights';

  getFlights(): Observable<Flight[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  createFlight(flight: Flight): Observable<Flight> {
    return this.http.post<any>(this.apiUrl, flight).pipe(
      map(res => res.data)
    );
  }

  updateFlight(id: number, flight: Flight): Observable<Flight> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, flight).pipe(
      map(res => res.data)
    );
  }

  deleteFlight(id: number): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
