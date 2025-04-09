import { Component } from '@angular/core';
import { AuthService } from '../../data/auth.service';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, 
    MatButtonModule, MatDatepickerModule, MatNativeDateModule, RouterLink, AngularFireAuthModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  authError: string = '';
  isSubmitting: boolean = false;

  constructor(public authService : AuthService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.authError = '';
      
      this.authService.register(this.registerForm.value.email, this.registerForm.value.password)
        .then(success => {
          if (success) {
            this.router.navigate(['/garage']);
          }
        })
        .catch(error => {
          if (error.code == 'auth/email-already-in-use') {
            this.authError = "Email already in use"
          } else{
            this.authError = 'Registration failed. Please try again.';
          }
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    }
  }
}