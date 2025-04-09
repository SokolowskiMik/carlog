import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../data/car.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-garage-form',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,CommonModule,MatButtonModule,MatDatepickerModule,MatNativeDateModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './garage-form.component.html',
  styleUrl: './garage-form.component.scss'
})
export class GarageFormComponent {
  carId: string | null = null;
  carForm!: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private carService: CarService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // this.carId = this.route.snapshot.paramMap.get('carId') ? +this.route.snapshot.paramMap.get('carId')! : null;
    this.carId = this.route.snapshot.paramMap.get('carId');
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear())]], 
      mileage: ['', [Validators.required, Validators.min(0)]],
      vin: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]], 
      registration: ['', Validators.required],
      horsePower: ['', [Validators.required, Validators.min(1)]],
      engineCapacity: ['', [Validators.required, Validators.min(0.1)]],
      image: [null], 
      technicalInspectionDate: ['', Validators.required],
      insuranceEndDate: ['', Validators.required],
      registrationCertificateNumber: ['', Validators.required]
    });
    console.log(this.carId);
    if (this.carId) {
      this.loadCarData();
    }
  }

  loadCarData() {
    if (!this.carId) return;
    
    this.isLoading = true;
    this.carService.getCarById(this.carId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (car) => {
          if (car) {
            // Handle date conversion for technicalInspectionDate
            if (car.technicalInspectionDate) {
              // If stored as Firestore Timestamp, convert to Date
              if (car.technicalInspectionDate.toDate) {
                car.technicalInspectionDate = car.technicalInspectionDate.toDate();
              } 
              // If stored as string, convert to Date
              else if (typeof car.technicalInspectionDate === 'string') {
                car.technicalInspectionDate = new Date(car.technicalInspectionDate);
              }
              
              car.technicalInspectionDate = formatDateOnly(car.technicalInspectionDate);
            }

            if (car.insuranceEndDate) {
              // If stored as Firestore Timestamp, convert to Date
              if (car.insuranceEndDate.toDate) {
                car.insuranceEndDate = car.insuranceEndDate.toDate();
              } 
              // If stored as string, convert to Date
              else if (typeof car.insuranceEndDate === 'string') {
                car.insuranceEndDate = new Date(car.insuranceEndDate);
              }

              car.insuranceEndDate = formatDateOnly(car.insuranceEndDate);
            }
            
            this.carForm.patchValue(car);
          } else {
            this.snackBar.open('Car not found!', 'Close', { duration: 3000 });
            this.router.navigate(['/garage']);
          }
        },
        error: (err) => {
          console.error('Error loading car data:', err);
          this.snackBar.open('Error loading car data', 'Close', { duration: 3000 });
        }
      });
  }

  onFileSelect(event: any) {
    if (event.target.files?.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  async onSubmit() {
    if (this.carForm.invalid) {
      this.snackBar.open('Please fix the errors in the form', 'Close', { duration: 3000 });
      return;
    }
    
    try {
      this.isLoading = true;
      const carData = this.carForm.value;
      
      // Convert date to string for Firestore
      if (carData.technicalInspectionDate instanceof Date) {
        carData.technicalInspectionDate = formatDateOnly(carData.technicalInspectionDate);
      }

      if (carData.insuranceEndDate instanceof Date) {
        carData.insuranceEndDate = formatDateOnly(carData.insuranceEndDate);
      }
      
      if (this.carId) {
        // Update existing car
        await this.carService.updateCar(this.carId, carData, this.selectedFile || undefined);
        this.snackBar.open('Car updated successfully!', 'Close', { duration: 3000 });
      } else {
        // Add new car
        await this.carService.addCar(carData, this.selectedFile || undefined);
        this.snackBar.open('Car added successfully!', 'Close', { duration: 3000 });
      }
      
      this.router.navigate(['/garage']);
    } catch (error) {
      console.error('Error saving car:', error);
      this.snackBar.open('Error saving car data', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }
  
}
function formatDateOnly(date: Date): string {
  return date.toISOString().split('T')[0]; // gets YYYY-MM-DD
}