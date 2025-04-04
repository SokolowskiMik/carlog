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
    {path:'',component:TestComponent},
    {path: 'garage', component: GarageComponent, canActivate: [authGuard] },
    {path: 'garage-form', component: GarageFormComponent, canActivate: [authGuard] },
    {path: 'garage-form/:carId', component: GarageFormComponent, canActivate: [authGuard] },
    {path: 'current-car/:carId', component: CurrentCarComponent, canActivate: [authGuard] },
    {path: 'insurance/:insuranceId/:carId', component: InsuranceComponent, canActivate: [authGuard] },
    {path: 'insurance-form/:carId', component: InsuranceFormComponent, canActivate: [authGuard] },
    {path: 'insurance-form/:insuranceId/:carId', component: InsuranceFormComponent, canActivate: [authGuard] },
    {path: 'fuel/:carId', component: FuelComponent, canActivate: [authGuard] },
    {path: 'fuel-details/:fuelId', component: FuelDetailsComponent, canActivate: [authGuard] },
    {path: 'fuel-form', component: FuelFormComponent, canActivate: [authGuard] },
    {path: 'fuel-form/:fuelId', component: FuelFormComponent, canActivate: [authGuard] },
    {path: 'notes', component: NotesComponent, canActivate: [authGuard] },
    {path: 'notes-details/:noteId', component: NotesDetailsComponent, canActivate: [authGuard] },
    {path: 'notes-form', component: NotesFormComponent, canActivate: [authGuard] },
    {path: 'notes-form/:noteId', component: NotesFormComponent, canActivate: [authGuard] },

    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    // {path: 'twitter-login', component: LoginTwitterComponent}
];
