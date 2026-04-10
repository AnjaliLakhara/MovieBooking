import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router'; 
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 

import { UserProfile, Movie } from '../../../core/models/movie.model';
import { MovieService } from '../../../core/services/movie.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  private firestore = inject(Firestore);
  private movieService = inject(MovieService);
  private snackBar = inject(MatSnackBar);


  users$: Observable<UserProfile[]> = collectionData(
    collection(this.firestore, 'users'), { idField: 'uid' }
  ) as Observable<UserProfile[]>;

  movies$: Observable<Movie[]> = this.movieService.getMovies();

  async deleteMovie(movieId: string, movieTitle: string) {
    if (confirm(`Are you sure you want to permanently delete "${movieTitle}"?`)) {
      try {
        await this.movieService.deleteMovie(movieId);
        this.snackBar.open(`Deleted ${movieTitle}`, 'Close', { duration: 3000 });
      } catch (error) {
        this.snackBar.open('Failed to delete movie', 'Close', { duration: 3000 });
      }
    }
  }
}