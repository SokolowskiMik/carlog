// import { Component } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIcon } from '@angular/material/icon';
// import {MatTableModule} from '@angular/material/table';
// import { Router, RouterLink } from '@angular/router';

// export interface PeriodicElement {
//   name: string;
//   fuelId: number;
//   weight: number;
//   symbol: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {fuelId: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {fuelId: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {fuelId: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {fuelId: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {fuelId: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {fuelId: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {fuelId: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {fuelId: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {fuelId: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {fuelId: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  
// ];

// @Component({
//   selector: 'app-fuel',
//   standalone: true,
//   imports: [MatTableModule,MatButtonModule,MatIcon,RouterLink],
//   templateUrl: './fuel.component.html',
//   styleUrl: './fuel.component.scss'
// })
// export class FuelComponent {
//   displayedColumns: string[] = [ 'name','symbol'];
//   dataSource = ELEMENT_DATA;
//   constructor(private router : Router){}
//   onRowClick(row: any): void {
//     this.router.navigate(['/fuel-details',row.fuelId])
//   }

//   onDeleteClick( element: any): void {
//     console.log('Delete button clicked', element);
//   }

//   carId!: string;

//   ngOnInit(){
//     const currentUrl = window.location.pathname;
//     this.carId = currentUrl.split('/')[2];  
//   }
// }


import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FuelService } from '../../data/fuel.service';
import { Fuel } from '../../data/fuel';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fuel',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './fuel.component.html',
  styleUrl: './fuel.component.scss'
})
export class FuelComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource: Fuel[] = [];
  carId: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fuelService: FuelService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('carId') || '';
    
    if (this.carId) {
      this.loadFuels();
    } else {
      this.snackBar.open('Car ID not found', 'Close', { duration: 3000 });
    }
  }

  loadFuels(): void {
    this.fuelService.getFuels(this.carId).subscribe({
      next: (fuels) => {
        this.dataSource = fuels;
      },
      error: (err) => {
        console.error('Error loading fuel records:', err);
        this.snackBar.open('Error loading fuel records', 'Close', { duration: 3000 });
      }
    });
  }

  viewFuelDetails(fuel: Fuel): void {
    this.router.navigate(['/car', this.carId, 'fuel-details', fuel.id]);
  }

  deleteFuel(fuel: Fuel): void {
    this.fuelService.deleteFuel(this.carId, fuel.id!)
      .then(() => {
        this.snackBar.open('Fuel record deleted successfully', 'Close', { duration: 3000 });
        this.loadFuels();
      })
      .catch((error) => {
        console.error('Error deleting fuel record:', error);
        this.snackBar.open('Error deleting fuel record', 'Close', { duration: 3000 });
      });
  }

  addFuel(): void {
    this.router.navigate(['/car', this.carId, 'fuel-form']);
  }
}