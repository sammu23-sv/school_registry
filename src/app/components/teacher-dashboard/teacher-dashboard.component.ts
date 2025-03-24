import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarksService } from '../../services/marks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class TeacherDashboardComponent implements OnInit {
  marksList: any[] = []; // Stores student marks
  subjects: any[] = [];  // ✅ Fix: Declare subjects array
  marksForm: FormGroup; // Form for adding marks
  studentForm: FormGroup; // Form for adding students
  studentId: string = ''; // Used for fetching marks

  constructor(
    private marksService: MarksService, 
    private fb: FormBuilder, 
    private router: Router
  ) {
    // ✅ Initialize Marks Form
    this.marksForm = this.fb.group({
      studentId: ['', Validators.required],
      subId: ['', Validators.required],
      month: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
      year: [null, [Validators.required, Validators.min(2000), Validators.max(new Date().getFullYear())]],
      score: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    // ✅ Initialize Student Form
    this.studentForm = this.fb.group({
      studentId: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSubjects(); // ✅ Fetch subjects on initialization
  }

  /** ✅ Fetch Subjects */
  loadSubjects() {
    this.marksService.getSubjects().subscribe({
      next: (data) => this.subjects = data,
      error: (err) => console.error('Error fetching subjects:', err)
    });
  }

  /** ✅ Fetch Marks */
  loadMarks() {
    if (!this.studentId.trim()) {
      console.error("Student ID is required to fetch marks.");
      return;
    }

    this.marksService.getStudentMarks(this.studentId).subscribe({
      next: (data) => this.marksList = data,
      error: (err) => console.error('Error loading marks:', err)
    });
  }

  /** ✅ Add Marks */
  addMark() {
    if (this.marksForm.invalid) {
      console.error("Form is invalid, please check your inputs.");
      return;
    }

    const { studentId, subId, month, year, score } = this.marksForm.value;

    this.marksService.addMark(studentId, subId, month, year, score).subscribe({
      next: () => {
        this.loadMarks(); // Refresh list
        this.marksForm.reset();
      },
      error: (err) => console.error('Error adding marks:', err)
    });
  }

  /** ✅ Update Marks */
  updateMark(studentId: string, subId: string, newScore: number) {
    if (newScore < 0 || newScore > 100) {
      console.error("Score must be between 0 and 100.");
      return;
    }

    this.marksService.updateMark(studentId, subId, newScore).subscribe({
      next: () => this.loadMarks(),
      error: (err) => console.error('Error updating marks:', err)
    });
  }

  /** ✅ Delete Marks */
  deleteMark(studentId: string, subId: string) {
    this.marksService.deleteMark(studentId, subId).subscribe({
      next: () => this.loadMarks(),
      error: (err) => console.error('Error deleting marks:', err)
    });
  }


  
  
}
