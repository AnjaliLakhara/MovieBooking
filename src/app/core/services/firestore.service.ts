import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  getCollection<T>(path: string): Observable<T[]> {
    const ref = collection(this.firestore, path);
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  getDocument<T>(path: string): Observable<T> {
    const ref = doc(this.firestore, path);
    return docData(ref, { idField: 'id' }) as Observable<T>;
  }

  addDocument(path: string, data: any): Promise<string> {
    const ref = collection(this.firestore, path);
    return addDoc(ref, { ...data, createdAt: new Date() })
      .then(docRef => docRef.id);
  }

  updateDocument(path: string, data: any): Promise<void> {
    const ref = doc(this.firestore, path);
    return updateDoc(ref, { ...data, updatedAt: new Date() });
  }

  deleteDocument(path: string): Promise<void> {
    const ref = doc(this.firestore, path);
    return deleteDoc(ref);
  }
}