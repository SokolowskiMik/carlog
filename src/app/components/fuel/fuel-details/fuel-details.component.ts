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
  isLoading = false;
  error = false;

  constructor(
    private fuelService: FuelService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // First try to get from route params
    this.carId = this.route.snapshot.paramMap.get('carId') || '';
    this.fuelId = this.route.snapshot.paramMap.get('fuelId') || '';
    
    // If not in params, try to extract from URL
    if (!this.carId || !this.fuelId) {
      const currentUrl = window.location.pathname;
      const segments = currentUrl.split('/');
      
      if (currentUrl.includes('fuel-details/')) {
        const carIndex = segments.indexOf('car');
        if (carIndex !== -1 && segments.length > carIndex + 1) {
          this.carId = segments[carIndex + 1];
        }
        
        const fuelIndex = segments.indexOf('fuel-details');
        if (fuelIndex !== -1 && segments.length > fuelIndex + 1) {
          this.fuelId = segments[fuelIndex + 1];
        }
      } else if (currentUrl.includes('fuel-details/')) {
        // Assuming direct URL like /fuel-details/123
        const fuelDetailsIndex = segments.indexOf('fuel-details');
        if (fuelDetailsIndex !== -1 && segments.length > fuelDetailsIndex + 1) {
          this.fuelId = segments[fuelDetailsIndex + 1];
          
          // Try to get carId from previous segments if available
          if (fuelDetailsIndex > 1) {
            this.carId = segments[fuelDetailsIndex - 1];
          }
        }
      }
    }

    if (this.carId && this.fuelId) {
      this.loadFuelDetails();
    } else {
      this.error = true;
      this.snackBar.open('Car ID or Fuel ID not found', 'Close', { duration: 3000 });
    }
  }

  loadFuelDetails(): void {
    this.isLoading = true;
    this.fuelService.getFuel(this.carId, this.fuelId).subscribe({
      next: (fuel) => {
        this.fuelDetails = fuel;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading fuel details:', err);
        this.error = true;
        this.isLoading = false;
        this.snackBar.open('Error loading fuel details', 'Close', { duration: 3000 });
      }
    });
  }

  editFuel(): void {
    this.router.navigate(['/car', this.carId, 'fuel-form', this.fuelId]);
  }

  deleteFuel(): void {
    if (confirm('Are you sure you want to delete this fuel record?')) {
      this.isLoading = true;
      this.fuelService.deleteFuel(this.carId, this.fuelId)
        .then(() => {
          this.snackBar.open('Fuel record deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/car', this.carId, 'fuel']);
        })
        .catch((error) => {
          console.error('Error deleting fuel record:', error);
          this.snackBar.open('Error deleting fuel record', 'Close', { duration: 3000 });
          this.isLoading = false;
        });
    }
  }

  goBackToFuelList(): void {
    this.router.navigate(['/car', this.carId, 'fuel']);
  }
}