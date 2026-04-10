import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface Booking {
  id?: string;
  userId: string;
  userEmail: string | null;
  movieId: string;
  movieTitle: string;
  seats: string[];
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: any;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async createBooking(bookingData: Omit<Booking, 'id' | 'userId' | 'userEmail' | 'createdAt' | 'status'>) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Must be logged in to book');

    const newBooking: Booking = {
      ...bookingData,
      userId: user.uid,
      userEmail: user.email,
      status: 'Pending',
      createdAt: new Date()
    };

    const ref = collection(this.firestore, 'bookings');
    return await addDoc(ref, newBooking);
  }

  getUserBookings(): Observable<Booking[]> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Not logged in');
    
    const q = query(collection(this.firestore, 'bookings'), where('userId', '==', user.uid));
    return collectionData(q, { idField: 'id' }) as Observable<Booking[]>;
  }

  getAllBookings(): Observable<Booking[]> {
    return collectionData(collection(this.firestore, 'bookings'), { idField: 'id' }) as Observable<Booking[]>;
  }

  async updateStatus(bookingId: string, status: 'Pending' | 'Confirmed' | 'Cancelled') {
    const ref = doc(this.firestore, `bookings/${bookingId}`);
    await updateDoc(ref, { status });
  }
}