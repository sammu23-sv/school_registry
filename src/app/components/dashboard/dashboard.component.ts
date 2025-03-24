import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
})
export class DashboardComponent implements OnInit {
  selectedSection: string = 'dashboard'; 
  selectedAction: string = ''; // Default: Show Add User form
  showUserDropdown: boolean = false; // ✅ Add this line
  selectedMonth: number | null = null;  // ✅ Fix: Declare selectedMonth
  selectedYear: number | null = null;   // ✅ Fix: Declare selectedYear
  studentForm!: FormGroup;  // ✅ Fix: Declare studentForm
  showAddStudentForm = false;
  showEditStudentForm = false;
  userName: string = '';
  dashboardData: any = null;
  
  // Forms
 monthForm!: FormGroup; // Ensure it's declared
  userForm: FormGroup;
  editStudentForm: FormGroup;

  students: any[] = [];
  users: { id: number; username: string; role: string }[] = [];
  months: { id: number; name: string }[] = [];
  editingStudentId: number | null = null;

  // API URLs
  studentApiUrl = 'http://localhost:5000/students';
  userApiUrl = 'http://localhost:5000/users';
  dashboardApiUrl = 'http://localhost:5000/dashboard/stats';

  role: string | null = localStorage.getItem('role');

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    // ✅ Initialize Forms
    this.monthForm = this.fb.group({
      month: ['', Validators.required],
      year: ['2025', [Validators.required, Validators.min(2000)]],
    });

    this.userForm = this.fb.group({
      id: '',
      username: '',
      password: '',
      role: '',
    });

    this.editStudentForm = this.fb.group({
      student_id: ['', Validators.required], 
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeMonths();
    this.fetchUsers();
    this.fetchStudents();
    this.userName = localStorage.getItem('userName') || ''; 
  }

  // ✅ Initialize Month Dropdown
  private initializeMonths() {
    this.months = [
      { id: 1, name: 'January' }, { id: 2, name: 'February' }, { id: 3, name: 'March' },
      { id: 4, name: 'April' }, { id: 5, name: 'May' }, { id: 6, name: 'June' },
      { id: 7, name: 'July' }, { id: 8, name: 'August' }, { id: 9, name: 'September' },
      { id: 10, name: 'October' }, { id: 11, name: 'November' }, { id: 12, name: 'December' }
    ];
  }

  // ✅ Change Section View
  changeSection(section: string) {
    this.selectedSection = section;
    this.showUserDropdown = false; // Close dropdown after clicking
  }

  

  





// ✅ Fetch Dashboard Data
fetchDashboardData() {
  if (!this.selectedMonth || !this.selectedYear) {
    console.error('❌ Please select a valid month and year.');
    return;
  }

  const requestUrl = `${this.dashboardApiUrl}?month=${this.selectedMonth}&year=${this.selectedYear}`;

  this.http.get(requestUrl).subscribe(
    (response: any) => {
      console.log('✅ Dashboard Data:', response);
      this.dashboardData = response;
    },
    (error) => {
      console.error('❌ Error fetching data:', error);
    }
  );

  console.log('Selected Month:', this.selectedMonth);
  console.log('Selected Year:', this.selectedYear);
}

  // ✅ Fetch Students
  fetchStudents() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(this.studentApiUrl, { headers }).subscribe(
      (data) => {
        this.students = data;
      },
      (error) => {
        console.error('❌ Error fetching students:', error);
      }
    );
  }

  // ✅ Toggle Forms
  toggleAddStudent() {
    this.showAddStudentForm = !this.showAddStudentForm;
  }

  toggleEditStudent(student: any) {
    if (!student.student_id) {
      console.error("❌ Student ID is missing.");
      return;
    }

    this.editingStudentId = student.student_id;
    this.showEditStudentForm = true;
    this.showAddStudentForm = false;

    this.editStudentForm.patchValue({
      student_id: student.student_id,
      name: student.name,
    });
  }

  // ✅ Add Student
  addStudent() {
    this.router.navigate(['/add-student']);
  }

  // ✅ Update Student
  updateStudent() {
    if (this.editStudentForm.invalid) {
      console.error("❌ Form is invalid. Please fill all required fields.");
      return;
    }

    const updatedStudent = this.editStudentForm.value;
    const studentId = updatedStudent.student_id;

    if (!studentId) {
      console.error("❌ Student ID is missing for update.");
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http.put(`${this.studentApiUrl}/${studentId}`, updatedStudent, { headers })
      .subscribe(
        (response) => {
          console.log("✅ Student updated successfully", response);
          this.showEditStudentForm = false;
          this.fetchStudents();
        },
        (error) => {
          console.error("❌ Error updating student:", error);
        }
      );
  }

  // ✅ Delete Student
  deleteStudent(studentId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${this.studentApiUrl}/${studentId}`, { headers }).subscribe(
      () => {
        console.log('✅ Student deleted');
        this.fetchStudents();
      },
      (error) => {
        console.error('❌ Error deleting student:', error);
      }
    );
  }

  // ✅ Fetch Users
  fetchUsers() {
    this.http.get<{ id: number; username: string; role: string }[]>(this.userApiUrl).subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('❌ Error fetching users:', error);
      }
    );
  }

// ✅ Add User
addUser(): void {
  const newUser = this.userForm.value;
  this.http.post(`${this.userApiUrl}/add`, newUser).subscribe({
    next: (response) => {
      console.log('✅ User added successfully:', response);
      this.fetchUsers();
      this.userForm.reset();
    },
    error: (error) => {
      console.error('❌ Error adding user:', error);
    },
  });
}

  // ✅ Delete User
  deleteUser(id: number): void {
    this.http.delete(`${this.userApiUrl}/delete/${id}`).subscribe({
      next: () => {
        console.log('✅ User deleted successfully');
        this.users = this.users.filter((user) => user.id !== id);
      },
      error: (error) => {
        console.error('❌ Error deleting user:', error);
      },
    });
  }


  // ✅ Check if User is Admin or Teacher
  isAdminOrTeacher(): boolean {
    return this.role === 'admin' || this.role === 'teacher';
  }

  // ✅ Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  // ✅ Navigation Methods
  goToUserManagement(): void {
    this.selectedSection = 'manageUsers';
  }

  goToManageStudents(): void {
    this.selectedSection = 'manageStudents';
  }

  gotoStudentDetails(): void {
    this.selectedSection = 'studentDetails';
  }

  navigateToStudentList(): void {
    this.selectedSection = 'studentsList';
  }
}
