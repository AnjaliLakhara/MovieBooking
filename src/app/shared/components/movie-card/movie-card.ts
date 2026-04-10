import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1. IMPORT MATERIAL MODULES
import { MatCardModule } from '@angular/material/card'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Movie } from '../../../core/models/movie.model';

// FIX 1: Import MatDialogModule alongside MatDialog
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 

// FIX 2: Ensure this matches your actual Quick View class name perfectly
import { QuickView } from '../../../features/browse/quick-view/quick-view';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  // FIX 3: Replace MatDialog with MatDialogModule here
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  private dialog = inject(MatDialog);
  
  @Output() saveToHotlist = new EventEmitter<string>();
  @Output() bookTickets = new EventEmitter<string>();

  onSaveClick(event: Event): void {
    event.stopPropagation(); 
    this.saveToHotlist.emit(this.movie.id);
  }

  openQuickView(): void {
    this.dialog.open(QuickView, {  
      data: this.movie,
      maxWidth: '800px', 
      panelClass: 'custom-dialog'
    });
  }
}