import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { InsuranceService } from '../../../data/insurance.service';

@Component({
  selector: 'app-insurance-form',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,CommonModule,MatButtonModule,MatDatepickerModule,MatNativeDateModule,RouterModule],
  templateUrl: './insurance-form.component.html',
  styleUrl: './insurance-form.component.scss'
})
// export class InsuranceFormComponent {
//   insuranceForm!: FormGroup;
//   insuranceId! :  number | null
//   constructor(private fb: FormBuilder,private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.insuranceId = this.route.snapshot.paramMap.get('carId') ? +this.route.snapshot.paramMap.get('insuranceId')! : null;
//     this.insuranceForm = this.fb.group({
//       insurer: ['', Validators.required],
//       type_of_insurance: ['', Validators.required],
//       service: ['', Validators.required],
//       policy_number: ['', Validators.required],
//       date_of_contract_conclusion: ['', Validators.required],
//       start_of_insurance: ['', Validators.required],
//       end_of_insurance: ['', Validators.required],
//       phone_number_to_call: ['', [Validators.required, Validators.pattern('^[0-9]{2} [0-9]{3} [0-9]{3} [0-9]{3}$')]],
//     });
//   }

//   onSubmit() {
//     if (this.insuranceForm.valid) {
//       console.log(this.insuranceForm.value);
//     } else {
//       console.log('Form is invalid');
//     }
//   }
  
// }

export class InsuranceFormComponent implements OnInit {
  insuranceForm!: FormGroup;
  carId!: string;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private insuranceService: InsuranceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('carId') || '';
    
    this.insuranceForm = this.fb.group({
      insurer: ['', Validators.required],
      typeOfInsurance: ['', Validators.required],
      service: ['', Validators.required],
      policyNumber: ['', Validators.required],
      dateOfContractConclusion: ['', Validators.required],
      startOfInsurance: ['', Validators.required],
      endOfInsurance: ['', Validators.required],
      phoneNumberToCall: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{2} [0-9]{3} [0-9]{3} [0-9]{3}$')
      ]],
    });

    this.loadExistingInsurance();
  }

  loadExistingInsurance() {
    this.insuranceService.getInsuranceForCar(this.carId).subscribe({
      next: (insurance) => {
        if (insurance) {
          this.isEditing = true;          
          this.insuranceForm.patchValue(insurance);
        }
      },
      error: (error) => {
        console.error('Error loading insurance:', error);
        this.snackBar.open('Error loading insurance details', 'Close', { duration: 3000 });
      }
    });
  }

  async onSubmit() {
    if (this.insuranceForm.invalid) {
      this.snackBar.open('Please fix the errors in the form', 'Close', { duration: 3000 });
      return;
    }
    
    try {
      const insuranceData = this.insuranceForm.value;
      

      insuranceData.dateOfContractConclusion = formatDateOnly(insuranceData.dateOfContractConclusion);

  

      insuranceData.startOfInsurance = formatDateOnly(insuranceData.startOfInsurance);


      insuranceData.endOfInsurance = formatDateOnly(insuranceData.endOfInsurance);

      
      await this.insuranceService.saveInsurance(this.carId, insuranceData);
      this.snackBar.open(`Insurance ${this.isEditing ? 'updated' : 'added'} successfully!`, 'Close', { duration: 3000 });
      this.router.navigate(['/insurance', this.carId]);
    } catch (error) {
      console.error('Error saving insurance:', error);
      this.snackBar.open('Error saving insurance data', 'Close', { duration: 3000 });
    }
  }
  goToInsurance(){
    this.router.navigate(['/insurance',this.carId])
  }
  
}
function formatDateOnly(date: Date): string {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split('T')[0];
}