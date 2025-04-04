import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, browserSessionPersistence, user, User } from '@angular/fire/auth';
import { signInWithPopup, TwitterAuthProvider, setPersistence } from "firebase/auth";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private auth: Auth, 
  ) {
    this.user$ = user(this.auth);
    this.setSessionStoragePersistence();
  }

  async loginWithEmailPassword(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async loginWithTwitter() {
    try {
      const provider = new TwitterAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      console.error('Twitter Login Error:', error);
      throw error;    
    }
  }

  async register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async logOut() {
    await signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.auth, browserSessionPersistence);
  }
}
