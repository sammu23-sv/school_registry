import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css'],
  imports: [CommonModule, ReactiveFormsModule] // ✅ Ensure ReactiveFormsModule is imported
})
export class EditStudentComponent implements OnInit {
  studentForm: FormGroup;
  studentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.studentId = Number(this.route.snapshot.paramMap.get('id')); // ✅ Get student ID from route
    this.fetchStudentDetails();
  }

  fetchStudentDetails() {
    if (this.studentId) {
      this.http.get<{ name: string }>(`http://localhost:5000/students/${this.studentId}`).subscribe({
        next: (student) => {
          this.studentForm.patchValue(student); // ✅ Pre-fill form
        },
        error: (error) => console.error('Error fetching student:', error)
      });
    }
  }

  updateStudent() {
    if (this.studentForm.valid && this.studentId) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      this.http.put(`http://localhost:5000/students/${this.studentId}`, this.studentForm.value, { headers }).subscribe({
        next: () => {
          console.log('Student updated successfully');
          this.router.navigate(['/students']); // ✅ Redirect to student list
        },
        error: (error) => console.error('Error updating student:', error)
      });
    }
  }
}
