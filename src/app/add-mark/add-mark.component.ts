import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-mark',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-mark.component.html',
  styleUrls: ['./add-mark.component.css']
})
export class AddMarkComponent implements OnInit {
  studentId: string = '';
  subjectId: string = '';
  month: string = '';
  year: string = '';
  score: number | null = null;
  subjects: any[] = [];  // ✅ Store subjects fetched from backend
  apiUrl = 'http://localhost:5000/marks';  // ✅ Ensure correct API URL
  subjectUrl = 'http://localhost:5000/subjects';  // ✅ Backend API for fetching subjects

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSubjects();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  fetchSubjects(): void {
    this.http.get<any[]>(this.subjectUrl, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (data) => {
          console.log("Subjects Fetched:", data); // ✅ Debugging Log
          this.subjects = data;
        },
        error: (error) => {
          console.error("Error fetching subjects:", error);
          alert("Failed to load subjects!");
        }
      });
  }
  

  addMark(): void {
    if (!this.studentId || !this.subjectId || !this.month || !this.year || this.score === null) {
      alert("All fields are required!");
      return;
    }

    const newMark = { student_id: this.studentId, sub_id: this.subjectId, month: this.month, year: this.year, score: this.score };

    this.http.post(`${this.apiUrl}`, newMark, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          alert('Mark added successfully!');
          this.studentId = '';
          this.subjectId = '';
          this.month = '';
          this.year = '';
          this.score = null;
        },
        error: (error) => alert(error.error?.message || 'Failed to add mark.')
      });
  }
}
