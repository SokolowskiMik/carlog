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

  constructor(public authService : AuthService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.loginWithEmailPassword(this.loginForm.value.email, this.loginForm.value.password).then(success => {
        this.handleLoginResults(success);
      });
    } else {
      alert('Login failed! Please try again.!!!!!!!!');
    }
  }

  loginWithTwitter() {
    this.authService.loginWithTwitter().then(success => {
      this.handleLoginResults(success);
    });
  }

  private handleLoginResults(success: UserCredential | undefined) {
    if (success) {
      this.router.navigate(['/garage']);
    } else {
      alert('Login failed! Please try again.');
    }
  }
}

