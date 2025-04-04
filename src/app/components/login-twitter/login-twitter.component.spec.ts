import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTwitterComponent } from './login-twitter.component';

describe('LoginTwitterComponent', () => {
  let component: LoginTwitterComponent;
  let fixture: ComponentFixture<LoginTwitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginTwitterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginTwitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
