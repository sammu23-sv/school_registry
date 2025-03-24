import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';  // ✅ Define username
  password: string = '';  // ✅ Define password
  errorMessage: string = '';  // ✅ Error message for user feedback

  constructor(private authService: AuthService, private router: Router) {} // ✅ Inject AuthService & Router

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required';
      return;
    }
  
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        if (response && response.token && response.role && response.name) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('userName', response.name); // ✅ Store User's Name
          localStorage.setItem('studentName', response.name);
          
  
          console.log('User Logged In:', response.name); // ✅ Debugging Step
          console.log('User Role:', response.role);
  
          if (response.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (response.role === 'teacher') {
            this.router.navigate(['/marks-management']);
          } else if (response.role === 'student') {
            this.router.navigate(['/my-marks']);
          } else {
            this.errorMessage = 'Invalid role. Please contact support.';
          }
        } else {
          this.errorMessage = 'Invalid response from server.';
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.errorMessage = 'Invalid credentials. Please try again.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
        }
      }
    });
  }
  
}
