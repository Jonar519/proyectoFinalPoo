import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { API_V1 } from '../config/api.config';

export interface UserData {
  token: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${API_V1}/auth`;
  
  // Signals for state management
  user = signal<UserData | null>(null);
  isAuthenticated = computed(() => !!this.user());

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(res => res.data), // Extract data from ApiResponse wrapper
      tap(authData => {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(authData));
        this.user.set(authData);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
    this.router.navigate(['/auth/login']);
  }
}
