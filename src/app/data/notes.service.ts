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
  setDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { Note } from './notes';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class NotesService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private storage: Storage
  ) {}

  private get currentUser() {
    return user(this.auth);
  }

  private getNotesCollection(userId: string, carId: string) {
    return collection(this.firestore, `users/${userId}/cars/${carId}/notes`);
  }

  getNotes(carId: string): Observable<Note[]> {
    return this.currentUser.pipe(
      switchMap(user => {
        if (!user) return of([]);
        const notesCol = this.getNotesCollection(user.uid, carId);
        // Sort notes by creation date (newest first)
        const notesQuery = query(notesCol, orderBy('createdAt', 'desc'));
        return collectionData(notesQuery, { idField: 'id' }) as Observable<Note[]>;
      })
    );
  }

  getNote(carId: string, noteId: string): Observable<Note> {
    return this.currentUser.pipe(
      switchMap(user => {
        if (!user) throw new Error('Not authenticated');
        const noteDoc = doc(this.firestore, `users/${user.uid}/cars/${carId}/notes/${noteId}`);
        return docData(noteDoc, { idField: 'id' }) as Observable<Note>;
      })
    );
  }

  async addNote(carId: string, note: Note): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const noteData = {
      ...note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const notesCol = this.getNotesCollection(user.uid, carId);
    const docRef = await addDoc(notesCol, noteData);
    return docRef.id;
  }

  async updateNote(carId: string, noteId: string, note: Partial<Note>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const noteDocRef = doc(this.firestore, `users/${user.uid}/cars/${carId}/notes/${noteId}`);
    await updateDoc(noteDocRef, {
      ...note,
      updatedAt: serverTimestamp()
    });
  }

  async deleteNote(carId: string, noteId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // First get the note to check for files to delete
    try {
      const noteDoc = doc(this.firestore, `users/${user.uid}/cars/${carId}/notes/${noteId}`);
      const noteSnapshot = await docData(noteDoc, { idField: 'id' }).pipe().toPromise();
      
      if (noteSnapshot) {
        const note = noteSnapshot as Note;
        
        // Delete images from storage if they exist
        if (note.images && note.images.length > 0) {
          for (const imageUrl of note.images) {
            try {
              // Extract the storage path from the URL
              const storageRef = ref(this.storage, this.getStoragePathFromUrl(imageUrl));
              await deleteObject(storageRef);
            } catch (error) {
              console.error('Error deleting image:', error);
              // Continue with other deletions even if one fails
            }
          }
        }
        
        // Delete audio from storage if it exists
        if (note.audioUrl) {
          try {
            const storageRef = ref(this.storage, this.getStoragePathFromUrl(note.audioUrl));
            await deleteObject(storageRef);
          } catch (error) {
            console.error('Error deleting audio:', error);
          }
        }
      }
      
      // Finally delete the note document
      await deleteDoc(noteDoc);
    } catch (error) {
      console.error('Error during note deletion:', error);
      throw error;
    }
  }

  async uploadFile(file: File, path: string): Promise<string> {
    const fileRef = ref(this.storage, path);
    const uploadTask = await uploadBytesResumable(fileRef, file);
    return await getDownloadURL(fileRef);
  }
  
  // Helper method to extract storage path from URL
  private getStoragePathFromUrl(url: string): string {
    // Parse the URL to extract the path
    // This is a simplified version, might need adjustment based on your storage URL format
    try {
      const storageUrl = new URL(url);
      const pathMatch = storageUrl.pathname.match(/\/o\/([^?]+)/);
      if (pathMatch && pathMatch[1]) {
        return decodeURIComponent(pathMatch[1]);
      }
      return url; // Fallback to the original URL if we can't parse it
    } catch (e) {
      console.error('Error parsing storage URL:', e);
      return url;
    }
  }
}