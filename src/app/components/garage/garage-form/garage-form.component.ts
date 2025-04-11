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
  selectedFile: File | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private carService: CarService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
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
      registrationCertificateNumber: ['', Validators.required]
    });
    console.log(this.carId);
    if (this.carId) {
      this.loadCarData();
    }
  }

  loadCarData() {
    if (!this.carId) return;
    
    this.carService.getCarById(this.carId)
      .subscribe({
        next: (car) => {
          if (car) {
            if (car.technicalInspectionDate) {
              car.technicalInspectionDate = new Date(car.technicalInspectionDate);
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
      const carData = this.carForm.value;
      carData.technicalInspectionDate = formatDateOnly(carData.technicalInspectionDate);
      
      if (this.carId) {
        await this.carService.updateCar(this.carId, carData, this.selectedFile || undefined);
        this.snackBar.open('Car updated successfully!', 'Close', { duration: 3000 });
      } else {
        await this.carService.addCar(carData, this.selectedFile || undefined);
        this.snackBar.open('Car added successfully!', 'Close', { duration: 3000 });
      }
      
      this.router.navigate(['/garage']);
    } catch (error) {
      console.error('Error saving car:', error);
      this.snackBar.open('Error saving car data', 'Close', { duration: 3000 });
    }
  }

  goBack()
  {
    if(this.carId)
    {
      this.router.navigate(['/current-car',this.carId])
    }
    else{
      this.router.navigate(['/garage'])
    }
  }
  
}
function formatDateOnly(date: Date): string {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split('T')[0];
}