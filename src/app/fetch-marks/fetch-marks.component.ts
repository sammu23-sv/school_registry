import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-fetch-marks',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // ✅ Ensure HttpClientModule is imported
  templateUrl: './fetch-marks.component.html',
  styleUrls: ['./fetch-marks.component.css']
})
export class FetchMarksComponent {
  studentId: string = '';
  studentsMarks: any[] = [];
  apiUrl = 'http://localhost:5000/marks'; // ✅ Ensure correct API URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      alert("You are not authorized. Please login again.");
      return new HttpHeaders(); // Return empty headers to avoid errors
    }
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  fetchMarks(): void {
    if (!this.studentId.trim()) {
      alert("Please enter a Student ID.");
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}/teacher/${this.studentId}`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (data) => { 
          console.log("Fetched Marks:", data);
          this.studentsMarks = data;
        },
        error: (error) => {
          console.error('Error fetching marks', error);
          alert(error.error?.message || 'Failed to fetch marks.');
        }
      });
  }
}
