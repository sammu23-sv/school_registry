import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  private baseUrl = 'http://localhost:5000'; // Update with your API URL

  constructor(private http: HttpClient) {}

  /** ✅ Fetch student marks */
  getStudentMarks(studentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/marks/student/${studentId}`);
  }

  /** ✅ Add new mark */
  addMark(studentId: string, subId: string, month: number, year: number, score: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/marks/add`, { studentId, subId, month, year, score });
  }

  /** ✅ Update marks */
  updateMark(studentId: string, subId: string, newScore: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/marks/update`, { studentId, subId, score: newScore });
  }

  /** ✅ Delete marks */
  deleteMark(studentId: string, subId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/marks/delete/${studentId}/${subId}`);
  }

  /** ✅ Add a new student */
  addStudent(studentId: string, name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/students/add`, { studentId, name });
  }

  /** ✅ Fetch all subjects */
  getSubjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/subjects`);
  }
}
