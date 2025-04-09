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
import { UserCredential } from '@firebase/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,CommonModule, 
    MatButtonModule, MatDatepickerModule, MatNativeDateModule, RouterLink, AngularFireAuthModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  authError: string = '';
  isSubmittingStandardAuth: boolean = false;
  isSubmittingTwitterAuth: boolean = false;

  constructor(public authService : AuthService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmittingStandardAuth = true;
      this.authError = '';
      
      this.authService.loginWithEmailPassword(this.loginForm.value.email, this.loginForm.value.password)
        .then(success => {
          this.handleLoginResults(success);
        })
        .catch(error => {
          if (error.code == 'auth/invalid-credential') {
            this.authError = "Provided email or password is incorrect"
          } else{
            this.authError = 'Login failed. Please try again.';
          }
        })
        .finally(() => {
          this.isSubmittingStandardAuth = false;
        });
    }
  }

  loginWithTwitter() {
    this.isSubmittingTwitterAuth = true;
    this.authError = '';
    
    this.authService.loginWithTwitter()
      .then(success => {
        this.handleLoginResults(success);
      })
      .catch(error => {
        this.authError = 'Twitter login failed. Please try again.';
      })
      .finally(() => {
        this.isSubmittingTwitterAuth = false;
      });
  }

  private handleLoginResults(success: UserCredential | undefined) {
    if (success) {
      this.router.navigate(['/garage']);
    } else {
      this.authError = 'Login failed. Please try again.';
    }
  }
}