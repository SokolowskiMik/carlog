import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { CarService } from '../../data/car.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-garage',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatListModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  templateUrl: './garage.component.html',
  styleUrl: './garage.component.scss'
})
export class GarageComponent implements OnInit {
  cars: any[] = [];
  isLoading = false;
  
  constructor(
    private carService: CarService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.isLoading = true;
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cars:', err);
        this.isLoading = false;
        this.snackBar.open('Error loading your cars', 'Close', { duration: 3000 });
      }
    });
  }

  navigateToCarDetails(carId: string) {
    this.router.navigate(['/current-car', carId]);
  }

  editCar(carId: string) {
    this.router.navigate(['/garage-form', carId]);
  }

  deleteCar(carId: string) {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(carId)
        .then(() => {
          this.snackBar.open('Car deleted successfully', 'Close', { duration: 3000 });
        })
        .catch(err => {
          console.error('Error deleting car:', err);
          this.snackBar.open('Error deleting car', 'Close', { duration: 3000 });
        });
    }
  }
}
