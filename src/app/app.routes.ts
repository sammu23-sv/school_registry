import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { StudentMarksComponent } from './student-marks/student-marks.component';
import { MarksManagementComponent } from './marks-management/marks-management.component';
import { FetchMarksComponent } from './fetch-marks/fetch-marks.component';
import { AddMarkComponent } from './add-mark/add-mark.component';
import { AdminGuard } from './guards/admin.guard';





export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'students', component: StudentListComponent },
  { path: 'add-student', component: AddStudentComponent, canActivate: [AuthGuard] },
  { path: 'edit-student/:id', component: EditStudentComponent },
  { path: 'my-marks', component: StudentMarksComponent },
  { path: 'marks-management', component: MarksManagementComponent },
  { path: 'fetch-marks', component: FetchMarksComponent }, 
  { path: 'add-mark', component: AddMarkComponent },  // ✅ Add New Route
  { path: 'admin', component: DashboardComponent, canActivate: [AdminGuard] },



];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }