import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchMarksComponent } from './fetch-marks.component';

describe('FetchMarksComponent', () => {
  let component: FetchMarksComponent;
  let fixture: ComponentFixture<FetchMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FetchMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FetchMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
