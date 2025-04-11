// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-fuel-form',
//   standalone: true,
//   imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,CommonModule,MatButtonModule,MatDatepickerModule,MatNativeDateModule],
//   templateUrl: './fuel-form.component.html',
//   styleUrl: './fuel-form.component.scss'
// })
// export class FuelFormComponent {
//   fuelForm!: FormGroup;
//   fuelId!: number | null;
//   constructor(private route: ActivatedRoute, private fb: FormBuilder) {}

//   ngOnInit() {
//     this.fuelId = this.route.snapshot.paramMap.get('fuelId') ? +this.route.snapshot.paramMap.get('fuelId')! : null;
//     this.fuelForm = this.fb.group({
//       name: ['', Validators.required],
//       startingPoint: ['', Validators.required],
//       destination: ['', Validators.required],
//       distance: ['', [Validators.required, Validators.min(1)]], 
//       fuelConsumption: ['', [Validators.required, Validators.min(1)]],
//       petrolPrice: ['', [Validators.required, Validators.min(0.1)]], 
//       totalCost: [{ value: '',  }] 
//     });

//     this.fuelForm.valueChanges.subscribe(values => {
//       this.calculateTotalCost();
//     });
//   }

//   calculateTotalCost() {
//     const distance = this.fuelForm.get('distance')?.value;
//     const fuelConsumption = this.fuelForm.get('fuelConsumption')?.value;
//     const petrolPrice = this.fuelForm.get('petrolPrice')?.value;

//     if (distance && fuelConsumption && petrolPrice) {
//       const totalCost = (distance / 100) * fuelConsumption * petrolPrice;
//       this.fuelForm.patchValue({ totalCost: totalCost.toFixed(2) }, { emitEvent: false });
//     }
//   }

//   onSubmit() {
//     if (this.fuelForm.valid) {
//       console.log('Fuel Form Submitted:', this.fuelForm.value);
//     }
//   }
// }


import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuelService } from '../../../data/fuel.service';
import { Fuel } from '../../../data/fuel';

@Component({
  selector: 'app-fuel-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './fuel-form.component.html',
  styleUrl: './fuel-form.component.scss'
})
export class FuelFormComponent implements OnInit {
  fuelForm!: FormGroup;
  fuelId: string | null = null;
  carId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fuelService: FuelService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('carId') || '';
    this.fuelId = this.route.snapshot.paramMap.get('fuelId');

    this.fuelForm = this.fb.group({
      name: ['', Validators.required],
      startingPoint: ['', Validators.required],
      destination: ['', Validators.required],
      distance: ['', [Validators.required, Validators.min(1)]], 
      fuelConsumption: ['', [Validators.required, Validators.min(0.1)]],
      petrolPrice: ['', [Validators.required, Validators.min(0.1)]], 
      totalCost: [{ value: '', disabled: true }] 
    });

    this.fuelForm.valueChanges.subscribe(() => {
      this.calculateTotalCost();
    });

    if (this.fuelId) {
      this.loadFuelData();
    }
  }

  loadFuelData(): void {
    if (!this.fuelId || !this.carId) return;
    
    this.fuelService.getFuel(this.carId, this.fuelId).subscribe({
      next: (fuel) => {
        if (fuel) {
          this.fuelForm.patchValue(fuel);
        } else {
          this.snackBar.open('Fuel record not found', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error loading fuel record:', err);
        this.snackBar.open('Error loading fuel record details', 'Close', { duration: 3000 });
      }
    });
  }

  calculateTotalCost(): void {
    const distance = this.fuelForm.get('distance')?.value;
    const fuelConsumption = this.fuelForm.get('fuelConsumption')?.value;
    const petrolPrice = this.fuelForm.get('petrolPrice')?.value;

    if (distance && fuelConsumption && petrolPrice) {
      const totalCost = this.fuelService.calculateTotalCost(distance, fuelConsumption, petrolPrice);
      this.fuelForm.get('totalCost')?.setValue(totalCost.toFixed(2), { emitEvent: false });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.fuelForm.invalid) {
      this.snackBar.open('Please fix the errors in the form', 'Close', { duration: 3000 });
      return;
    }

    if (!this.carId) {
      console.error('No car ID available when submitting form');
      this.snackBar.open('Error: Car ID not found', 'Close', { duration: 3000 });
      return;
    }

    try {
      const formValues = this.fuelForm.getRawValue();
      
      const fuelData: Fuel = {
        ...formValues
      };
      
      if (this.fuelId) {
        await this.fuelService.updateFuel(this.carId, this.fuelId, fuelData);
        this.snackBar.open('Fuel record updated successfully', 'Close', { duration: 3000 });
      } else {
        await this.fuelService.addFuel(this.carId, fuelData);
        this.snackBar.open('Fuel record added successfully', 'Close', { duration: 3000 });
      }      
      this.router.navigate(['/car', this.carId, 'fuel']);
      
    } catch (error) {
      console.error('Error saving fuel record:', error);
      this.snackBar.open('Error saving fuel record', 'Close', { duration: 3000 });
    } 
  }
  goBackToFuelDetails(){
    this.router.navigate(["/car", this.carId, "fuel-details", this.fuelId]);
  }
}