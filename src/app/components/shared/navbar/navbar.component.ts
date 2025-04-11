import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule,MatIconModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isDisabled = false;
  carId! : number;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(() => {
      this.isDisabled = this.router.url === '/garage-form' ||
      this.router.url === '/garage' ;
    });
  }
  navigateToInsurance() {
    var carId = localStorage.getItem("carId")
    this.router.navigate(['/insurance/',carId]);
  }

  navigateToCurrentCar() {
    var carId = localStorage.getItem("carId")
    this.router.navigate(['/current-car', carId]);
  }

  navigateToFuel() {
    var carId = localStorage.getItem("carId")
    this.router.navigate(['/fuel', carId]);
  }

  navigateToNotes() {
    var carId = localStorage.getItem("carId")
    this.router.navigate(['/notes', carId]);
  }
}
