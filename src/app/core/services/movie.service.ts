import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where, doc, docData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Movie } from '../models/movie.model';
import { addDoc } from 'firebase/firestore';
import { updateDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private firestore = inject(Firestore);
  private moviesCollection = collection(this.firestore, 'movies');

  getMovies(filters?: any): Observable<Movie[]> {
    const activeMoviesQuery = query(
      this.moviesCollection, 
      where('isActive', '==', true)
    );

    return collectionData(activeMoviesQuery, { idField: 'id' }).pipe(
      map((data: any[]) => data as Movie[]),
      map(movies => {
        if (!filters || (filters.languages.length === 0 && filters.formats.length === 0 && filters.genres.length === 0)) {
          return movies;
        }

        return movies.filter(movie => {
          const matchLang = filters.languages.length === 0 || 
            movie.languages.some(lang => filters.languages.includes(lang));
            
          const matchFormat = filters.formats.length === 0 || 
            movie.formats.some(format => filters.formats.includes(format));
            
          const matchGenre = filters.genres.length === 0 || 
            movie.genres.some(genre => filters.genres.includes(genre));

          return matchLang && matchFormat && matchGenre; 
        });
      })
    );
  }

  async addMovie(movieData: Partial<Movie>): Promise<string> {
    try {
      const docRef = await addDoc(this.moviesCollection, {
        ...movieData,
        createdAt: new Date(), 
        isActive: true 
      });
      console.log('Movie added with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding movie: ', error);
      throw error;
    }
  }

  getMovieById(movieId: string): Observable<Movie | undefined> {
    const movieRef = doc(this.firestore, `movies/${movieId}`);
    return docData(movieRef, { idField: 'id' }) as Observable<Movie>;
  }

  async updateMovie(movieId: string, data: Partial<Movie>): Promise<void> {
    const movieRef = doc(this.firestore, `movies/${movieId}`);
    await updateDoc(movieRef, data);
  }

  async deleteMovie(movieId: string): Promise<void> {
    const movieRef = doc(this.firestore, `movies/${movieId}`);
    await deleteDoc(movieRef);
  }
}