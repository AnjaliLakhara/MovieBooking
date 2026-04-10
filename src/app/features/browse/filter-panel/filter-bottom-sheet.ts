import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MovieLanguage, MovieFormat , Genre } from '../../../core/models/movie.model';
import { GenreService } from '../../../core/services/genre.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter-bottom-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatButtonModule, MatIconModule],
  templateUrl: './filter-bottom-sheet.html',
  styleUrl: './filter-bottom-sheet.css'
})
export class FilterBottomSheetComponent {
  private genreService = inject(GenreService);
  
  categories = ['Language', 'Format', 'Genre'];
  activeCategory = 'Language';

  languages: MovieLanguage[] = ['English', 'Hindi', 'Korean', 'Japanese', 'Telegu'];
  formats: MovieFormat[] = ['2D', '3D', '4DX', 'IMAX', 'ScreenX'];
  
  genres$: Observable<Genre[]> = this.genreService.getGenres();

  selectedFilters = {
    languages: new Set<string>(),
    formats: new Set<string>(),
    genres: new Set<string>()
  };

  constructor(
    private bottomSheetRef: MatBottomSheetRef<FilterBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    if (data?.currentFilters) {
      data.currentFilters.languages.forEach((l: string) => this.selectedFilters.languages.add(l));
      data.currentFilters.formats.forEach((f: string) => this.selectedFilters.formats.add(f));
      data.currentFilters.genres.forEach((g: string) => this.selectedFilters.genres.add(g));
    }
  }

  setActiveCategory(category: string): void { this.activeCategory = category; }
  
  toggleSelection(type: 'languages' | 'formats' | 'genres', value: string): void {
    this.selectedFilters[type].has(value) ? this.selectedFilters[type].delete(value) : this.selectedFilters[type].add(value);
  }

  isItemSelected(type: 'languages' | 'formats' | 'genres', value: string): boolean {
    return this.selectedFilters[type].has(value);
  }

  clearAll(): void {
    this.selectedFilters.languages.clear();
    this.selectedFilters.formats.clear();
    this.selectedFilters.genres.clear();
  }

  applyFilters(): void {
    this.bottomSheetRef.dismiss({
      languages: Array.from(this.selectedFilters.languages),
      formats: Array.from(this.selectedFilters.formats),
      genres: Array.from(this.selectedFilters.genres)
    });
  }

  closeSheet(): void { this.bottomSheetRef.dismiss(); }
}