import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js/auto';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-marks-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './marks-management.component.html',
  styleUrls: ['./marks-management.component.css']
})
export class MarksManagementComponent implements OnInit, AfterViewInit {
  studentsMarks: any[] = [];
  studentName: string = ''; 
  studentId: string = '';
  newMark = { student_id: '', sub_id: '', month: '', year: '', score: '' };
  userRole: string = '';
  apiUrl = 'http://localhost:5000/marks';
  
  topStudents: any[] = [];
  chart: Chart | null = null;

  selectedSection: string = 'marks-management'; // Default section
  subjects = [
    { id: '12', name: 'Maths' },
    { id: '13', name: 'Science' },
    { id: '14', name: 'Social' },
    { id: '15', name: 'Kannada' },
    { id: '16', name: 'English' },
    { id: '17', name: 'Hindi' }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute // ✅ Inject ActivatedRoute
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('role') || '';

    if (this.userRole === 'admin') {
      this.router.navigate(['/dashboard']);
      return;
    }

    if (this.userRole !== 'teacher') {
      alert("Access denied! Only teachers can access this page.");
      this.router.navigate(['/login']);
      return;
    }

    this.fetchTopStudents();

    // ✅ Fix: Properly subscribe to query params
    this.route.queryParams.subscribe((params: any) => {
      if (params['id']) {
        this.studentId = params['id'];
        console.log("✅ Received Student ID from URL:", this.studentId);
        this.getStudentMarks();
      } else {
        console.warn("⚠️ No Student ID found in query params.");
      }
    });
}



  ngAfterViewInit() {
    this.createChart();
  }

  changeSection(section: string) {
    this.selectedSection = section;
  
    if (section === 'marks-management') {
      setTimeout(() => {
        this.renderChart();
      }, 100); // Slight delay to allow rendering
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }
  
  addStudent() {
    if (!this.studentName.trim()) {
      alert("Student name cannot be empty!");
      return;
    }

    // ✅ Get the stored token (assuming it's stored in localStorage after login)
    const token = localStorage.getItem('token'); 

    // ✅ Add Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:5000/students', { name: this.studentName }, { headers }).subscribe(
      response => {
        alert('Student added successfully!');
        this.studentName = ''; // Reset input field after adding
      },
      error => {
        console.error('Error adding student:', error);
        alert('Failed to add student: ' + error.error?.message);
      }
    );
  }

  


  

  getStudentMarks() {
    this.http.get(`${this.apiUrl}/teacher/${this.studentId}`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (data: any) => {
          this.studentsMarks = data;
          console.log("✅ Full API Response:", JSON.stringify(data, null, 2)); // Debugging
          
          if (this.studentsMarks.length > 0) {
              console.log("✅ First Entry in Student Marks:", this.studentsMarks[0]);
          } else {
              console.warn("⚠️ No student marks found!");
          }
        },
        error: (error) => {
          console.error("❌ Error fetching student marks:", error);
        }
      });
}




  addMark(): void {
    const { student_id, sub_id, month, year, score } = this.newMark;

    if (!student_id.trim() || !sub_id.trim() || !month.trim() || !year.trim()) {
      alert("All fields are required!");
      return;
    }

    const scoreNum = Number(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      alert("Score must be a number between 0 and 100.");
      return;
    }

    this.newMark.score = scoreNum.toString();

    this.http.post(this.apiUrl, this.newMark, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          alert('Mark added successfully!');
          this.getStudentMarks();
        },
        error: (error) => {
          console.error('Error adding mark', error);
          alert(error.error?.message || 'Failed to add mark.');
        }
      });
  }

  updateMark(studentId: any, subId: any, newScore: any): void {
    console.log("🔹 Attempting to Update Mark:");
    console.log("🔸 Student ID:", studentId);
    console.log("🔸 Subject ID:", subId);
    console.log("🔸 New Score:", newScore);

    if (!studentId || !subId) {
        console.error("❌ Error: studentId or subId is undefined!");
        alert("Error: Missing student or subject ID.");
        return;
    }

    // ✅ Ensure newScore is a valid number
    const scoreNum = parseFloat(newScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
        alert("Score must be a number between 0 and 100.");
        return;
    }

    console.log("✅ Sending API Request:", `${this.apiUrl}/${studentId}/${subId}`, { score: scoreNum });

    const updateUrl = `http://localhost:5000/marks/${studentId}/${subId}`;
console.log("🔹 Update API URL:", updateUrl);

this.http.put(updateUrl, { score: scoreNum }, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (response) => {
          console.log("✅ Mark updated successfully! Response:", response);
          alert('Mark updated successfully!');
          this.getStudentMarks(); // Refresh marks
        },
        error: (error) => {
          console.error("❌ Error updating mark:", error);
          alert(error.error?.message || 'Failed to update mark.');
        }
      });
}



  

  deleteMark(studentId: string, subId: string): void {
    if (!confirm("Are you sure you want to delete this mark?")) return;

    this.http.delete(`${this.apiUrl}/${studentId}/${subId}`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          alert('Mark deleted successfully!');
          this.getStudentMarks();
        },
        error: (error) => {
          console.error('Error deleting mark', error);
          alert(error.error?.message || 'Failed to delete mark.');
        }
      });
  }

  getSubjectName(subId: string): string {
    return this.subjects.find(s => s.id === subId)?.name || subId;
  }

  

  navigateTo(path: string, studentId?: number): void {
    if (path === 'marks-management' && studentId) {
        this.router.navigate([`/${path}`], { queryParams: { id: studentId } });
    } else {
        this.router.navigate([`/${path}`]);
    }
}


  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  fetchTopStudents(): void {
    this.http.get<any[]>(`${this.apiUrl}/top-students`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (data) => {
          this.topStudents = data;
          this.updateChart();
        },
        error: (error) => {
          console.error('Error fetching top students', error);
        }
      });
  }

  createChart(): void {
    const chartElement = document.getElementById('marksChart') as HTMLCanvasElement;
    if (!chartElement) {
      console.warn("Chart element not found!");
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.topStudents.length) {
      console.warn("No data available for the chart!");
      return;
    }

    const labels = this.topStudents.map(student => student.sub_name);
    const marks = this.topStudents.map(student => student.score);
    const studentNames = this.topStudents.map(student => student.student_name);

    this.chart = new Chart(chartElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Top Student Marks',
          data: marks,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const studentIndex = tooltipItem.dataIndex;
                return `${studentNames[studentIndex] || 'Unknown'}: ${tooltipItem.raw} Marks`;
              }
            }
          },
          legend: { display: true, position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Subjects' } },
          y: { beginAtZero: true, title: { display: true, text: 'Marks' } }
        }
      }
    });
  }

  private updateChart(): void {
    if (!this.chart) {
      this.createChart();
      return;
    }

    const labels = this.topStudents.map(student => student.sub_name);
    const marks = this.topStudents.map(student => student.score);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = marks;

    this.chart.update();
  }
  renderChart() {
    const ctx = document.getElementById('marksChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Biology', 'Science', 'Social', 'Kannada', 'English', 'Hindi'],
          datasets: [{
            label: 'Top Student Marks',
            data: [75, 82, 95, 94, 85, 84],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  
  }
} 

