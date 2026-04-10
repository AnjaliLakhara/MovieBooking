import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, switchMap, map, combineLatest, of } from 'rxjs';

import { HotlistService } from '../../../../core/services/hotlist.service';
import { MovieService } from '../../../../core/services/movie.service';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card';
import { Movie, Hotlist } from '../../../../core/models/movie.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hotlist-details',
  imports: [CommonModule,MatSnackBarModule, RouterModule, MatIconModule, MatButtonModule, MovieCardComponent],
  templateUrl: './hotlist-details.html',
  styleUrl: './hotlist-details.css',
})
export class HotlistDetails {
private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hotlistService = inject(HotlistService);
  private movieService = inject(MovieService);
  private snackBar = inject(MatSnackBar);

  // This combines the list data AND the movie data into one clean stream!
  viewData$: Observable<{ list: Hotlist | undefined, savedMovies: Movie[] }> = this.route.paramMap.pipe(
    switchMap(params => {
      const listId = params.get('id');
      if (!listId) return of({ list: undefined, savedMovies: [] });

      return combineLatest([
        this.hotlistService.getHotlistById(listId),
        this.movieService.getMovies() // Fetch all movies
      ]).pipe(
        map(([list, allMovies]) => {
          if (!list || !list.movieIds) return { list, savedMovies: [] };
          
          // Filter the global movie list to ONLY show ones in this watchlist
          const savedMovies = allMovies.filter(movie => list.movieIds.includes(movie.id));
          return { list, savedMovies };
        })
      );
    })
  );

  async removeMovie(listId: string, movieId: string, movieTitle: string) {
    try {
      await this.hotlistService.removeMovieFromHotlist(listId, movieId);
      this.snackBar.open(`${movieTitle} removed from list`, 'Close', { duration: 3000 });
      // The UI will automatically update because viewData$ is listening in real-time!
    } catch (error) {
      console.error(error);
      this.snackBar.open('Failed to remove movie', 'Close', { duration: 3000 });
    }
  }

  async deleteList(listId: string, listName: string) {
    const confirmDelete = confirm(`Are you sure you want to delete the watchlist "${listName}"?`);
    if (!confirmDelete) return;

    try {
      await this.hotlistService.deleteHotlist(listId);
      this.snackBar.open(`Watchlist deleted`, 'Close', { duration: 3000 });
      
      // Navigate back to the profile page since this list no longer exists!
      this.router.navigate(['/user/profile']);
    } catch (error) {
      console.error(error);
      this.snackBar.open('Failed to delete list', 'Close', { duration: 3000 });
    }
  }
}
