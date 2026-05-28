import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_V1 } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private http = inject(HttpClient);
  private apiUrl = `${API_V1}/routes`;

  getRoutes(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(map(res => res.data));
  }
}
