import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiringInsurenceDialogComponent } from './expiring-insurence-dialog.component';

describe('ExpiringInsurenceDialogComponent', () => {
  let component: ExpiringInsurenceDialogComponent;
  let fixture: ComponentFixture<ExpiringInsurenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiringInsurenceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiringInsurenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
