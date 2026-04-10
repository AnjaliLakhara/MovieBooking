import { Injectable, NgZone, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { UserProfile } from '../models/movie.model';
import { deleteUser } from '@angular/fire/auth';
import { deleteDoc} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private zone = inject(NgZone); 

  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUserProfile$ = this.userProfileSubject.asObservable();

  constructor() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.fetchUserProfile(user.uid);
      } else {
        this.zone.run(() => this.userProfileSubject.next(null));
      }
    });
  }

  private fetchUserProfile(uid: string) {
    const docRef = doc(this.firestore, `users/${uid}`);
    
    onSnapshot(docRef, (docSnap) => {
      this.zone.run(() => {
        if (docSnap.exists()) {
          this.userProfileSubject.next(docSnap.data() as UserProfile);
        }
      });
    });
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signup(email: string, password: string, name: string): Promise<any> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const newUser: UserProfile = {
      uid: cred.user.uid,
      email: email,
      displayName: name,
      role: 'user', 
      createdAt: new Date()
    };
    await setDoc(doc(this.firestore, `users/${cred.user.uid}`), newUser);
    return cred;
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  async deleteAccount(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No user is currently logged in.');

    try {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await deleteDoc(userRef);
      await deleteUser(user);
      this.userProfileSubject.next(null);
      
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please log out and log back in to verify your identity before deleting your account.');
      }
      throw error;
    }
  }
}