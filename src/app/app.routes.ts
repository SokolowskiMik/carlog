import { Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { GarageComponent } from './components/garage/garage.component';
import { CurrentCarComponent } from './components/current-car/current-car.component';
import { GarageFormComponent } from './components/garage/garage-form/garage-form.component';
import { InsuranceComponent } from './components/insurance/insurance.component';
import { InsuranceFormComponent } from './components/insurance/insurance-form/insurance-form.component';
import { FuelComponent } from './components/fuel/fuel.component';
import { FuelDetailsComponent } from './components/fuel/fuel-details/fuel-details.component';
import { FuelFormComponent } from './components/fuel/fuel-form/fuel-form.component';
import { NotesComponent } from './components/notes/notes.component';
import { NotesDetailsComponent } from './components/notes/notes-details/notes-details.component';
import { NotesFormComponent } from './components/notes/notes-form/notes-form.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './data/auth.guard';

export const routes: Routes = [
    {path: 'garage', component: GarageComponent, canActivate: [authGuard] },
    {path: 'garage-form', component: GarageFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'garage-form/:carId', component: GarageFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'current-car/:carId', component: CurrentCarComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'insurance/:carId', component: InsuranceComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'insurance/:carId/:insuranceId', component: InsuranceComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'insurance-form/:carId', component: InsuranceFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'insurance-form/:carId/:insuranceId', component: InsuranceFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'fuel/:carId', component: FuelComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'fuel-details/:fuelId', component: FuelDetailsComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'fuel-form', component: FuelFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'fuel-form/:carId', component: FuelFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'fuel-form/:fuelId', component: FuelFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'car/:carId/fuel', component: FuelComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'car/:carId/fuel-details/:fuelId', component: FuelDetailsComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'car/:carId/fuel-form', component: FuelFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'car/:carId/fuel-form/:fuelId', component: FuelFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'notes', component: NotesComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'notes/:carId', component: NotesComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'notes-details/:carId/:noteId', component: NotesDetailsComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'notes-form', component: NotesFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },
    {path: 'notes-form/:noteId', component: NotesFormComponent, canActivate: [authGuard], data: { renderMode: 'default' }  },

    {path: 'register', component: RegisterComponent,},
    {path: 'login', component: LoginComponent },
    {path: '**', component: GarageComponent, canActivate: [authGuard]  },
];
