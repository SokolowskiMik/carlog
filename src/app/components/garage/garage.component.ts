import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { CarService } from '../../data/car.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VibrationsService } from '../../data/vibrations.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpiringInsurenceDialogComponent } from '../shared/expiring-insurence-dialog/expiring-insurence-dialog.component';

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
  insuranceExpiring: string[] = [];
  
  constructor(
    private carService: CarService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog:MatDialog,
    private messagesService: VibrationsService
  ) {}

  ngOnInit() {
    localStorage.removeItem('carId')
    this.loadCars();
    this.messagesService.checkInsuranceExpirations().subscribe(names => {
      this.insuranceExpiring = names;

      if (names.length > 0) {
        this.messagesService.triggerAlert();
      }
      const dialogRef = this.dialog.open(ExpiringInsurenceDialogComponent, {
        data: { names : names}
      });
  
      return dialogRef.afterClosed().toPromise().then(result => {
        return result;
      });

    });
  }

  loadCars() {
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
      },
      error: (err) => {
        console.error('Error loading cars:', err);
        this.snackBar.open('Error loading your cars', 'Close', { duration: 3000 });
      }
    });
  }

  navigateToCarDetails(carId: string) {
    localStorage.setItem('carId',carId)
    this.router.navigate(['/current-car', carId]);
  }

  editCar(carId: string) {
    this.router.navigate(['/garage-form', carId]);
  }

  deleteCar(carId: string) {

    this.openDialog().then(confirmed => {
      if (confirmed) {
        this.carService.deleteCar(carId)
          .then(() => {
            this.snackBar.open('Car deleted successfully', 'Close', { duration: 3000 });
          })
          .catch(err => {
            console.error('Error deleting car:', err);
            this.snackBar.open('Error deleting car', 'Close', { duration: 3000 });
          });
      }
    });
  }

    openDialog(): Promise<boolean> {
      const dialogRef = this.dialog.open(DialogComponent, {});
  
      return dialogRef.afterClosed().toPromise().then(result => {
        console.log('The dialog was closed', result);
        return result;
      });
    }
}
