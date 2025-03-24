import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-marks',
  standalone: true,
  templateUrl: './student-marks.component.html',
  styleUrls: ['./student-marks.component.css'],
  imports: [CommonModule, FormsModule]
})
export class StudentMarksComponent implements OnInit {
  marks: any[] = [];
  filteredMarks: any[] = [];
  studentName: string = '';

  selectedMonth: string = '';
  selectedYear: string = '';

  uniqueMonths: number[] = [];
  uniqueYears: number[] = [];

  apiUrl = 'http://localhost:5000/students';

  http = inject(HttpClient);
  router = inject(Router);

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.studentName = localStorage.getItem('studentName') || 'Student';
    console.log("Retrieved Student Name:", this.studentName); // ✅ Debugging Step
  
    if (!token) {
      console.error('Token is missing in localStorage');
      alert('You need to log in again!');
      this.router.navigate(['/login']);
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.get<any[]>(`${this.apiUrl}/marks`, { headers }).subscribe({
      next: (response) => {
        console.log('Marks Data:', response);
        this.marks = response;
        this.filteredMarks = [];
  
        this.uniqueMonths = [...new Set(this.marks.map(m => m.month))];
        this.uniqueYears = [...new Set(this.marks.map(m => m.year))];
      },
      error: (error) => {
        console.error('Error fetching marks:', error);
      }
    });
  }
  

  filterMarks() {
    if (this.selectedMonth && this.selectedYear) {
      this.filteredMarks = this.marks.filter(m =>
        m.month == +this.selectedMonth && m.year == +this.selectedYear
      );
    } else {
      this.filteredMarks = []; // Hide table until both filters are selected
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
