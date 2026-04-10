import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, 
  updateDoc, arrayUnion, arrayRemove, deleteDoc,
  addDoc , docData} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, switchMap, of } from 'rxjs';
import { Hotlist } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class HotlistService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  getUserHotlists(): Observable<Hotlist[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]); 
        const ref = collection(this.firestore, `users/${user.uid}/hotlists`);
        return collectionData(ref, { idField: 'id' }) as Observable<Hotlist[]>;
      })
    );
  }

  async createHotlist(name: string): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Must be logged in');
    const ref = collection(this.firestore, `users/${user.uid}/hotlists`);
    const docRef = await addDoc(ref, { name, movieIds: [], createdAt: new Date(), updatedAt: new Date(), isDefaultList: false });
    return docRef.id;
  }

  async addMovieToHotlist(hotlistId: string, movieId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Must be logged in');
    const ref = doc(this.firestore, `users/${user.uid}/hotlists/${hotlistId}`);
    await updateDoc(ref, { movieIds: arrayUnion(movieId), updatedAt: new Date() });
  }

  getHotlistById(listId: string): Observable<Hotlist | undefined> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of(undefined);
        const ref = doc(this.firestore, `users/${user.uid}/hotlists/${listId}`);
        return docData(ref, { idField: 'id' }) as Observable<Hotlist>;
      })
    );
  }

  async removeMovieFromHotlist(hotlistId: string, movieId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Must be logged in');
    const ref = doc(this.firestore, `users/${user.uid}/hotlists/${hotlistId}`);
 
    await updateDoc(ref, { 
      movieIds: arrayRemove(movieId), 
      updatedAt: new Date() 
    });
  }
  async deleteHotlist(hotlistId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Must be logged in');
    const ref = doc(this.firestore, `users/${user.uid}/hotlists/${hotlistId}`);
    
    await deleteDoc(ref);
  }
}