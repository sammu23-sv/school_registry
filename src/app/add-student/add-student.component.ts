import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Required for common directives

@Component({
  selector: 'app-add-student',
  standalone: true,
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
  imports: [CommonModule, ReactiveFormsModule], // ✅ Fix: Add ReactiveFormsModule
})
export class AddStudentComponent {
  studentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required], 
    });
  }

  addStudent() {
    if (this.studentForm.valid) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.post('http://localhost:5000/students', this.studentForm.value, { headers })
        .subscribe({
          next: (response) => {
            console.log('Student added:', response);
            this.router.navigate(['/students']); // ✅ Redirect to student list
          },
          error: (error) => {
            console.error('Error adding student:', error);
          }
        });
    }
  }

  
}
