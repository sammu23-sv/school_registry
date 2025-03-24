import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // Ensure correct path
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule],
})
export class UserManagementComponent {
  userForm: FormGroup;
  users: any[] = [];
  showUsers: boolean = false;
  currentView: string = ''; // Initially empty

  fb = inject(FormBuilder);
  userService = inject(AuthService); // ✅ Make sure this exists

  constructor() {
    this.userForm = this.fb.group({
      id: [''],
      username: [''],
      password: [''],
      role: ['']
    });

    this.loadUsers();
  }

  showSection(view: string, event: Event) {
    event.preventDefault(); // Prevent default anchor behavior
    this.currentView = view;
  }

  // ✅ Fix deleteUser function
  deleteUser(userId: number) {
    if (confirm(`Are you sure you want to delete user with ID ${userId}?`)) {
      this.userService.deleteUser(userId.toString()).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadUsers(); // Refresh user list
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user.');
        }
      });
    }
  }
  
  

  // ✅ Function to load users
  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  addUser() {
    if (this.userForm.valid) {
      const { id, username, password, role } = this.userForm.value; // Extract form values
      this.userService.addUser(id, username, password, role).subscribe({
        next: () => {
          alert('User added successfully!');
          this.userForm.reset();
          this.loadUsers(); // Refresh user list
        },
        error: (err) => {
          console.error('Error adding user:', err);
          alert('Failed to add user.');
        }
      });
    }
  }
  

}
