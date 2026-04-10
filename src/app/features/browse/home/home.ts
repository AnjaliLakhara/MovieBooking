import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest, switchMap, map } from 'rxjs';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

import { MovieService } from '../../../core/services/movie.service';
import { SearchService } from '../../../core/services/search.service';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card';
import { FilterBottomSheetComponent } from '../filter-panel/filter-bottom-sheet';
import { SaveToHotlistSheetComponent } from '../../user-profile/hotlists/save-to-hotlist-sheet/save-to-hotlist-sheet';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, MatBottomSheetModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  private movieService = inject(MovieService);
  private bottomSheet = inject(MatBottomSheet);
  private searchService = inject(SearchService); 
  private route = inject(ActivatedRoute);

  private filtersSubject = new BehaviorSubject<any>(null);

  baseFilteredMovies$: Observable<Movie[]> = combineLatest([
    this.route.paramMap.pipe(map(params => params.get('lang'))),
    this.filtersSubject,
    this.searchService.searchQuery$
  ]).pipe(
    switchMap(([lang, filters, searchTerm]) => {
      let combinedFilters = filters ? { ...filters } : { languages: [], formats: [], genres: [] };
      if (lang && lang !== 'home') combinedFilters.languages = [lang.charAt(0).toUpperCase() + lang.slice(1)];

      return this.movieService.getMovies(combinedFilters).pipe(
        map(movies => {
          if (!searchTerm) return movies;
          const term = searchTerm.toLowerCase();
          return movies.filter(m => m.title.toLowerCase().includes(term) || m.description.toLowerCase().includes(term));
        })
      );
    })
  );

topHits$ = this.baseFilteredMovies$.pipe(
    map(movies => movies.filter(m => m.featuredLists?.includes('Top 10 Hits')))
  );

  curated$ = this.baseFilteredMovies$.pipe(
    map(movies => movies.filter(m => m.featuredLists?.includes('Curated For You')))
  );

  blockbusters$ = this.baseFilteredMovies$.pipe(
    map(movies => movies.filter(m => m.featuredLists?.includes('BlockBusters')))
  );

  cinematicMasterpiece$ = this.baseFilteredMovies$.pipe(
    map(movies => movies.filter(m => m.featuredLists?.includes('Cinematic Masterpiece')))
  );

  openFilterPanel(): void {
    const bottomSheetRef = this.bottomSheet.open(FilterBottomSheetComponent, {
      data: { currentFilters: this.filtersSubject.value }
    });
    bottomSheetRef.afterDismissed().subscribe(selectedFilters => {
      if (selectedFilters) this.filtersSubject.next(selectedFilters);
    });
  }

  handleBookTickets(movieId: string): void {
    console.log('Navigating to checkout...', movieId);
  }

  handleSaveToHotlist(movieId: string): void {
    this.bottomSheet.open(SaveToHotlistSheetComponent, { 
      data: { movieId: movieId },
      panelClass: 'custom-bottom-sheet-container' 
    });
  }
}