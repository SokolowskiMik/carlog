import { Injectable } from '@angular/core';
import { of, switchMap, map, forkJoin, Observable } from 'rxjs';
import {catchError, take } from 'rxjs/operators';
import { CarService } from './car.service';
import { InsuranceService } from './insurance.service';
import { Insurance } from './insurance';

@Injectable({
  providedIn: 'root'
})
export class VibrationsService {
  
  constructor(
    private carService: CarService,
    private insuranceService: InsuranceService
  ) {}

  checkInsuranceExpirations(): Observable<string[]> {
    return this.carService.getCars().pipe(
      take(1),
      switchMap(cars => {
        if (!cars.length) return of([]);

        const insuranceObservables = cars.map(car =>
          this.insuranceService.getInsuranceForCar(car.id).pipe(
            take(1),
            map(insurance => ({ carName: car.name, insurance })),
            catchError(() => of(null))
          )
        );

        return forkJoin(insuranceObservables);
      }),
      map(data => {
        const now = new Date();
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(now.getMonth() + 1);

        return (data.filter(Boolean) as { carName: string, insurance: Insurance }[])
          .filter(entry => {
            const endDate = new Date(entry.insurance.endOfInsurance);
            return endDate > now && endDate <= oneMonthFromNow;
          })
          .map(entry => entry.carName);
      })
    );
  }

  triggerAlert(): void {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }
}