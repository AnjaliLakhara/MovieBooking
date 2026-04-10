import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Genre } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class GenreService {
  private firestore = inject(Firestore);
  private genresCollection = collection(this.firestore, 'genres');

  getGenres(): Observable<Genre[]> {
    return collectionData(this.genresCollection, { idField: 'id' }) as Observable<Genre[]>;
  }

  addGenre(name: string): Promise<any> {
    return addDoc(this.genresCollection, { name });
  }
}