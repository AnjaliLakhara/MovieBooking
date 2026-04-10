import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GenreService } from '../../../core/services/genre.service';

@Component({
  selector: 'app-manage-genres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './manage-genres.html',
  styleUrl: './manage-genres.css'
})
export class ManageGenresComponent {
  private genreService = inject(GenreService);
  genres$ = this.genreService.getGenres();
  newGenre = '';

  async addGenre() {
    if (!this.newGenre.trim()) return;
    await this.genreService.addGenre(this.newGenre.trim());
    this.newGenre = ''; // clear input
  }
}