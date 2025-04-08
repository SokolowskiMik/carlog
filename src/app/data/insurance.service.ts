import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  docData, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { Insurance } from './insurance';

// @Injectable({
//   providedIn: 'root'
// })
// export class InsuranceService {
  
//   constructor(
//     private firestore: Firestore, 
//     private auth: Auth,
//   ) {}

//   // Get current user
//   private get currentUser() {
//     return user(this.auth);
//   }

//   private get currentCarId() {
//     const currentUrl = window.location.pathname;
//     var carId ="";
//     carId = currentUrl.split('/')[2];
    
//     return carId;
//   }

//   // Get an specific insurance by ID for current user's car
//   getUserInsuranceByCarId(carId: string): Observable<any> {
//     return this.currentUser.pipe(
//       switchMap(user => {
//         if (!user) return of(null);
        
//         const insuranceDocRef = doc(this.firestore, `users/${user.uid}/cars/${carId}`);
//         return docData(insuranceDocRef, { idField: 'id' });
//       })
//     );
//   }

//   // Add an new insurance for current user
//   async addInsurance(insurance: Insurance, imageFile?: File): Promise<string> {
//     const user = this.auth.currentUser;
//     if (!user) throw new Error('No authenticated user');
    
//     const insuranceData = {
//       ...insurance,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     };
    
//     const insuranceCollection = this.getUserCarInsuranceCollection(user.uid);
//     const docRef = await addDoc(insuranceCollection, insuranceData);
//     return docRef.id;
//   }

//   // Update an insurance for current user
//   async updateCarInsurance(carId: string, car: Partial<Car>, imageFile?: File): Promise<void> {
//     const user = this.auth.currentUser;
//     if (!user) throw new Error('No authenticated user');
    
//     const carData: any = {
//       ...car,
//       updatedAt: serverTimestamp()
//     };
    
//     const carDocRef = doc(this.firestore, `users/${user.uid}/cars/${carId}`);
//     return updateDoc(carDocRef, carData);
//   }

//   // Delete a car for current user
//   deleteInsurance(carId: string): Promise<void> {
//     const user = this.auth.currentUser;
//     if (!user) throw new Error('No authenticated user');
    
//     const carDocRef = doc(this.firestore, `users/${user.uid}/cars/${carId}`);
//     return deleteDoc(carDocRef);
//   }
// }

@Injectable({
    providedIn: 'root'
  })
  export class InsuranceService {
  
    constructor(
      private firestore: Firestore, 
      private auth: Auth
    ) {}
  
    // Get current user
    private get currentUser() {
      return user(this.auth);
    }
  
    // Helper to get insurance document reference for a specific car
    private getInsuranceDocRef(userId: string, carId: string) {
      return doc(this.firestore, `users/${userId}/cars/${carId}/insurance/details`);
    }
  
    // Get insurance for a specific car
    getInsuranceForCar(carId: string): Observable<Insurance | null> {
      return this.currentUser.pipe(
        switchMap(user => {
          if (!user) return of(null);
  
          const insuranceDocRef = this.getInsuranceDocRef(user.uid, carId);
          return docData(insuranceDocRef, { idField: 'id' }) as Observable<Insurance>;
        })
      );
    }
  
    // Check if insurance exists for a car
    async checkInsuranceExists(carId: string): Promise<boolean> {
      const user = this.auth.currentUser;
      if (!user) return false;
  
      try {
        const insuranceDocRef = this.getInsuranceDocRef(user.uid, carId);
        const docSnapshot = await docData(insuranceDocRef, { idField: 'id' }).pipe().toPromise();
        return !!docSnapshot;
      } catch (error) {
        console.error('Error checking insurance existence:', error);
        return false;
      }
    }
  
    // Add or update insurance for a car
    async saveInsurance(carId: string, insurance: Insurance): Promise<void> {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No authenticated user');
  
      const insuranceData = {
        ...insurance,
        carId: carId,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };
  
      const insuranceDocRef = this.getInsuranceDocRef(user.uid, carId);
      return setDoc(insuranceDocRef, insuranceData);
    }
  
    // Update insurance for a car
    async updateInsurance(carId: string, insuranceData: Partial<Insurance>): Promise<void> {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No authenticated user');
  
      const updatedData = {
        ...insuranceData,
        updatedAt: serverTimestamp()
      };
  
      const insuranceDocRef = this.getInsuranceDocRef(user.uid, carId);
      return setDoc(insuranceDocRef, updatedData, { merge: true });
    }
  
    // Delete insurance for a car
    async deleteInsurance(carId: string): Promise<void> {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No authenticated user');
  
      const insuranceDocRef = this.getInsuranceDocRef(user.uid, carId);
      return deleteDoc(insuranceDocRef);
    }
  }