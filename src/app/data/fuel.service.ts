import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { Fuel } from './fuel';

@Injectable({ providedIn: 'root' })
export class FuelService {
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  private get currentUser() {
    return user(this.auth);
  }

  private getFuelCollection(userId: string, carId: string) {
    return collection(this.firestore, `users/${userId}/cars/${carId}/fuel`);
  }

  getFuels(carId: string): Observable<Fuel[]> {
    return this.currentUser.pipe(
      switchMap(user => {
        if (!user) return of([]);
        const fuelCol = this.getFuelCollection(user.uid, carId);
        // Sort by creation date (newest first)
        const fuelQuery = query(fuelCol, orderBy('createdAt', 'desc'));
        return collectionData(fuelQuery, { idField: 'id' }) as Observable<Fuel[]>;
      })
    );
  }

  getFuel(carId: string, fuelId: string): Observable<Fuel> {
    return this.currentUser.pipe(
      switchMap(user => {
        if (!user) throw new Error('Not authenticated');
        const fuelDoc = doc(this.firestore, `users/${user.uid}/cars/${carId}/fuel/${fuelId}`);
        return docData(fuelDoc, { idField: 'id' }) as Observable<Fuel>;
      })
    );
  }

  async addFuel(carId: string, fuel: Fuel): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const fuelData = {
      ...fuel,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const fuelCol = this.getFuelCollection(user.uid, carId);
    const docRef = await addDoc(fuelCol, fuelData);
    return docRef.id;
  }

  async updateFuel(carId: string, fuelId: string, fuel: Partial<Fuel>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const fuelDocRef = doc(this.firestore, `users/${user.uid}/cars/${carId}/fuel/${fuelId}`);
    await updateDoc(fuelDocRef, {
      ...fuel,
      updatedAt: serverTimestamp()
    });
  }

  async deleteFuel(carId: string, fuelId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const fuelDocRef = doc(this.firestore, `users/${user.uid}/cars/${carId}/fuel/${fuelId}`);
    await deleteDoc(fuelDocRef);
  }

  calculateTotalCost(distance: number, fuelConsumption: number, petrolPrice: number): number {
    return (distance / 100) * fuelConsumption * petrolPrice;
  }
}