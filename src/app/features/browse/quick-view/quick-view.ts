import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-quick-view',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './quick-view.html',
  styleUrl: './quick-view.css',
})
export class QuickView {
  private router = inject(Router);

  constructor(
    public dialogRef: MatDialogRef<QuickView>,
    @Inject(MAT_DIALOG_DATA) public movie: Movie
  ) {}

  close() { this.dialogRef.close(); }

  bookTickets() {
    this.dialogRef.close();
    this.router.navigate(['/user/book', this.movie.id]); 
  }
}
