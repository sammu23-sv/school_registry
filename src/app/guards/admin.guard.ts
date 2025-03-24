import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    const userRole = this.authService.getRole(); // Assumes role is stored in AuthService

    if (userRole === 'Admin') {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login if unauthorized
      return false;
    }
  }
}
