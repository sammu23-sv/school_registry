import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  name: string = '';
  role: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.name = localStorage.getItem('username') || ''; // ✅ Get Name
    this.role = localStorage.getItem('role') || ''; // ✅ Get Role

    console.log('User Role:', this.role); // ✅ Debugging Step
    console.log('User Name:', this.name); // ✅ Debugging Step

    this.cdr.detectChanges(); // ✅ Force UI Update
  }
}
