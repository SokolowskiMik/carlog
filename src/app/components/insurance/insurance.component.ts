import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InsuranceService } from '../../data/insurance.service';
import { Insurance } from '../../data/insurance';
@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [MatCardModule,MatButtonModule,RouterLink,CommonModule,MatDialogModule,MatSnackBarModule],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.scss'
})
// export class InsuranceComponent {
//   insurance = {
//     insuranceId:1,
//     insurer: "ABC Insurance Co.",
//     type_of_insurance: "Car Insurance",
//     service: "Comprehensive Coverage",
//     policy_number: "A123-4567-XYZ",
//     date_of_contract_conclusion: "2024-03-01",
//     start_of_insurance: "2024-03-05",
//     end_of_insurance: "2025-03-05",
//     phone_number_to_call: "+48 123 456 789"
//   }
//   carId!: string;

//   ngOnInit(){
//     const currentUrl = window.location.pathname;
//     this.carId = currentUrl.split('/')[2];  
//   }

// }
export class InsuranceComponent implements OnInit {
  insurance: Insurance | null = null;
  carId!: string;
  loading = true;
  error = false;

  constructor(
    private insuranceService: InsuranceService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Extract carId from URL
    const currentUrl = window.location.pathname;
    this.carId = currentUrl.split('/')[2];
    
    // Load insurance data for this car
    this.loadInsurance();
  }

  loadInsurance() {
    this.loading = true;
    this.insuranceService.getInsuranceForCar(this.carId).subscribe({
      next: (data) => {
        this.insurance = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading insurance:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  // Add this method to handle insurance deletion
  deleteInsurance() {
    // You can add a confirmation dialog here if you want
    const confirmDelete = confirm('Are you sure you want to delete this insurance?');
    
    if (confirmDelete) {
      this.loading = true;
      this.insuranceService.deleteInsurance(this.carId)
        .then(() => {
          this.snackBar.open('Insurance deleted successfully', 'Close', { duration: 3000 });
          this.insurance = null;
          // Optionally, navigate back to the car details page
          // this.router.navigate(['/car', this.carId]);
        })
        .catch((error) => {
          console.error('Error deleting insurance:', error);
          this.snackBar.open('Error deleting insurance', 'Close', { duration: 3000 });
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
}