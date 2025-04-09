import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarService } from '../../data/car.service';
import { Car } from '../../data/car';
@Component({
  selector: 'app-current-car',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatCardModule,MatDividerModule,RouterLink,MatIconModule,MatProgressSpinnerModule,MatSnackBarModule],
  templateUrl: './current-car.component.html',
  styleUrl: './current-car.component.scss'
})
// export class CurrentCarComponent {
//   car = {
//     id: 1,
//     name: 'Lightning McQueen',
//     model: 'Ka-Chow 5000',
//     brand : "alfa",
//     year: 2006, 
//     mileage: 123456,
//     vin: '1C4RJFBG9JC123456', 
//     registration: 'RAC3CAR',
//     horsePower: 750,
//     engineCapacity: 5.7, 
//     image: null,
//     technicalInspectionDate: '2025-01-01',
//     registrationCertificateNumber: 'DOC-95',
//     insuranceEndDate: '2025-01-01'
//   };

//   constructor(private router: Router) {}

//   editCar(car: Car) {
//     this.router.navigate(['/edit-car', car]);
//   }
// }

export class CurrentCarComponent implements OnInit {
  carId!: string;
  car: any;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.carId = this.route.snapshot.paramMap.get('carId')!;
    if (this.carId) {
      this.loadCar();
    }
  }

  loadCar() {
    this.carService.getCarById(this.carId).subscribe({
      next: (car) => {
        this.car = car;
      },
      error: (err) => {
        console.error('Error loading car:', err);
        this.snackBar.open('Error loading car details', 'Close', { duration: 3000 });
        this.router.navigate(['/garage']);
      }
    });
  }

  deleteCar() {

    this.carService.deleteCar(this.carId)
      .then(() => {
        this.snackBar.open('Car deleted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/garage']);
      })
      .catch(err => {
        console.error('Error deleting car:', err);
        this.snackBar.open('Error deleting car', 'Close', { duration: 3000 });
      });
}

  
}
