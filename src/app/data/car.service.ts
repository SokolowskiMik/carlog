import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, from, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Car } from './car';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  
  constructor(
    private firestore: Firestore, 
    private auth: Auth,
    private storage: Storage
  ) {}

  // Get current user
  private get currentUser() {
    return user(this.auth);
  }

  // Helper to get user's cars collection reference
  private getUserCarsCollection(userId: string) {
    return collection(this.firestore, `users/${userId}/cars`);
  }

  // Get all cars for current user
  getCars(): Observable<any[]> {
    return this.currentUser.pipe(
      switchMap(user => {
        if (!user) return of([]);
        
        const carsCollection = this.getUserCarsCollection(user.uid);
        return collectionData(carsCollection, { idField: 'id' });
      })
    );
  }

  // Get a specific car by ID for current user
  getCarById(carId: string): Observable<any> {
    return this.currentUser.pipe(
      switchMap(user => {
        if (!user) return of(null);
        
        const carDocRef = doc(this.firestore, `users/${user.uid}/cars/${carId}`);
        return docData(carDocRef, { idField: 'id' });
      })
    );
  }

  // Upload image and return URL
  async uploadImage(file: File): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    
    const filePath = `car-images/${user.uid}/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);
    
    const uploadTask = await uploadBytesResumable(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    
    return downloadURL;
  }

  // Add a new car for current user
  async addCar(car: Car, imageFile?: File): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    
    let imageUrl = null;
    
    // Upload image if provided
    if (imageFile) {
      imageUrl = await this.uploadImage(imageFile);
    }
    
    const carData = {
      ...car,
      image: imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const carsCollection = this.getUserCarsCollection(user.uid);
    const docRef = await addDoc(carsCollection, carData);
    return docRef.id;
  }

  // Update a car for current user
  async updateCar(carId: string, car: Partial<Car>, imageFile?: File): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    
    const carData: any = {
      ...car,
      updatedAt: serverTimestamp()
    };
    
    // Upload new image if provided
    if (imageFile) {
      carData.image = await this.uploadImage(imageFile);
    }
    
    const carDocRef = doc(this.firestore, `users/${user.uid}/cars/${carId}`);
    return updateDoc(carDocRef, carData);
  }

  // Delete a car for current user
  deleteCar(carId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    
    const carDocRef = doc(this.firestore, `users/${user.uid}/cars/${carId}`);
    return deleteDoc(carDocRef);
  }
}