import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/routes'; // I'll need to create this controller in backend too

  getRoutes(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(map(res => res.data));
  }
}
