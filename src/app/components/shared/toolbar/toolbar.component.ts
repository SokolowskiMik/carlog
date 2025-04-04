import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AuthService } from '../../../data/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  constructor(private authService : AuthService, private router: Router) {}

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
