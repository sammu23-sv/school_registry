import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'; // ✅ Import Router


@Component({
  selector: 'app-student-list',
  standalone: true,
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
  imports: [CommonModule, HttpClientModule] // ✅ Ensure required modules
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  role: string | null = localStorage.getItem('role'); // ✅ Get user role
  apiUrl = 'http://localhost:5000/students';

  constructor(private http: HttpClient, private router: Router) {} // ✅ Inject Router


  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
    const token = localStorage.getItem('token'); // ✅ Retrieve JWT token

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // ✅ Include Authorization header
    });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe(
      (data) => {
        console.log("Students fetched:", data);
        this.students = data;
      },
      (error) => {
        console.error("Error fetching students:", error);
      }
    );
  }

  addStudent() {
    this.router.navigate(['/add-student']); // ✅ Navigate to Add Student Page
  }

  editStudent(studentId: number) {
    this.router.navigate([`/edit-student/${studentId}`]); // ✅ Navigate to edit page
  }

  

  deleteStudent(studentId: number) {
    const token = localStorage.getItem('token'); // ✅ Ensure token is included

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.delete(`${this.apiUrl}/${studentId}`, { headers }).subscribe(
      () => {
        console.log('Student deleted');
        this.fetchStudents(); // Refresh list
      },
      (error) => {
        console.error('Error deleting student:', error);
      }
    );
  }
}
