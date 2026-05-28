import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_V1 } from '../config/api.config';

export interface MenuItem {
  id: number;
  label: string;
  icon: string;
  route: string;
  requiredRole: string;
  children: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = `${API_V1}/menu`;

  getMenu(): Observable<MenuItem[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }
}
