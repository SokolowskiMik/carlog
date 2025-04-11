// import { Component } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-fuel-details',
//   standalone: true,
//   imports: [MatCardModule,MatButtonModule,RouterLink],
//   templateUrl: './fuel-details.component.html',
//   styleUrl: './fuel-details.component.scss'
// })
// export class FuelDetailsComponent {
//   fuelDetails =   {
//     fuelId :1,
//     name: "Trip 1",
//     startingPoint: "Krakow",
//     destination: "Warsaw",
//     distance: 300,
//     fuelConsumption: 7.5,
//     petrolPrice: 5.5,
//     totalCost: (300 / 100) * 7.5 * 5.5
//   }
// }


import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FuelService } from '../../../data/fuel.service';
import { Fuel } from '../../../data/fuel';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-fuel-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './fuel-details.component.html',
  styleUrl: './fuel-details.component.scss'
})
export class FuelDetailsComponent implements OnInit {
  fuelDetails: Fuel | null = null;
  carId: string = '';
  fuelId: string = '';

  constructor(
    private fuelService: FuelService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('carId') || '';
    this.fuelId = this.route.snapshot.paramMap.get('fuelId') || '';

    if (this.carId && this.fuelId) {
      this.loadFuelDetails();
    } else {
      this.snackBar.open('Car ID or Fuel ID not found', 'Close', { duration: 3000 });
    }
  }

  loadFuelDetails(): void {
    this.fuelService.getFuel(this.carId, this.fuelId).subscribe({
      next: (fuel) => {
        this.fuelDetails = fuel;
      },
      error: (err) => {
        console.error('Error loading fuel details:', err);
        this.snackBar.open('Error loading fuel details', 'Close', { duration: 3000 });
      }
    });
  }

  editFuel(): void {
    this.router.navigate(['/car', this.carId, 'fuel-form', this.fuelId]);
  }

  deleteFuel(): void {
    this.openDialog().then(confirmed => {
      if (confirmed) {
        this.fuelService.deleteFuel(this.carId, this.fuelId)
          .then(() => {
            this.snackBar.open('Fuel record deleted successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/car', this.carId, 'fuel']);
          })
          .catch((error) => {
            console.error('Error deleting fuel record:', error);
            this.snackBar.open('Error deleting fuel record', 'Close', { duration: 3000 });
          });
      }
    });
    
  }

  goBackToFuel(): void {
    this.router.navigate(['/fuel',this.carId]);
  }
  openDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {});

    return dialogRef.afterClosed().toPromise().then(result => {
      console.log('The dialog was closed', result);
      return result;
    });
  }
}