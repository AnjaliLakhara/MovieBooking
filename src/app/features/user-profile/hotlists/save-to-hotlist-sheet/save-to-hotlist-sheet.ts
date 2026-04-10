import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Hotlist } from '../../../../core/models/movie.model';
import { HotlistService } from '../../../../core/services/hotlist.service';

@Component({
  selector: 'app-save-to-hotlist-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './save-to-hotlist-sheet.html',
  styleUrls: ['./save-to-hotlist-sheet.css']
})
export class SaveToHotlistSheetComponent {
  private hotlistService = inject(HotlistService);
  private snackBar = inject(MatSnackBar);
  
  hotlists$: Observable<Hotlist[]> = this.hotlistService.getUserHotlists();
  
  isCreatingNew = false;
  newListName = '';

  constructor(
    private bottomSheetRef: MatBottomSheetRef<SaveToHotlistSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { movieId: string }
  ) {}

  async saveToList(hotlist: Hotlist): Promise<void> {
    try {
      await this.hotlistService.addMovieToHotlist(hotlist.id, this.data.movieId);
      this.snackBar.open(`Saved to ${hotlist.name}`, 'Close', { duration: 3000 });
      this.bottomSheetRef.dismiss();
    } catch (error) {
      console.error('Error saving movie:', error);
      this.snackBar.open('Failed to save movie.', 'Close', { duration: 3000 });
    }
  }

  async createNewList(): Promise<void> {
    if (!this.newListName.trim()) return;
    try {
      const newListId = await this.hotlistService.createHotlist(this.newListName);
      await this.hotlistService.addMovieToHotlist(newListId, this.data.movieId);
      
      this.snackBar.open(`Created list and saved movie!`, 'Close', { duration: 3000 });
      this.bottomSheetRef.dismiss();
    } catch (error) {
      console.error('Error creating list:', error);
    }
  }
}