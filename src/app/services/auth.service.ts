import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators'; // ✅ Import tap from rxjs/operators


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // ✅ Correct Backend API URL

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Return the Observable instead of subscribing inside the service
  login(username: string, password: string): Observable<{ token: string; role: string }> {
    return this.http.post<{ token: string; role: string }>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          // ✅ Store token and role in localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);

          console.log("User Role:", response.role); // ✅ Debugging Log

          // ✅ Redirect based on role
          switch (response.role) {
            case 'admin':
              this.router.navigate(['/dashboard']);
              break;
            case 'teacher':
              this.router.navigate(['/teacher-dashboard']);
              break;
            case 'student':
              this.router.navigate(['/student-dashboard']);
              break;
            default:
              console.error("Invalid role, redirecting to login");
              this.router.navigate(['/login']);
          }
        }
      })
    );
  }
    
  
  getRole(): string | null {
    return localStorage.getItem('role'); // ✅ Get role from localStorage
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']); // ✅ Redirect to login on logout
  }
  getMonths(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/dashboard/stats?month=5&year=2025`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);

  }


  addUser(id: string, username: string, password: string, role: string): Observable<any> {
    const userData = { id, username, password, role };
    return this.http.post<any>(`${this.apiUrl}/users/add`, userData); // ✅ Ensure correct endpoint
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  getLoggedInUser() {
    return {
      name: localStorage.getItem('teacherName') || '',
      role: localStorage.getItem('role') || ''
    };
  }
  
  

  
}
