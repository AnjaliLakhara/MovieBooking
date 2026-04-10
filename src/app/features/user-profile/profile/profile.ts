import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule , Router} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/auth.service';
import { HotlistService } from '../../../core/services/hotlist.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatSnackBarModule, MatCardModule,RouterModule,MatCardModule,MatTabsModule,MatIconModule, MatButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  authService = inject(AuthService);
  hotlistService = inject(HotlistService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  bookingService = inject(BookingService);

  myBookings$ = this.bookingService.getUserBookings();
  hotlists$ = this.hotlistService.getUserHotlists();

  async deleteAccount() {
    const confirmDelete = confirm('Are you sure you want to permanently delete your account? This action cannot be undone and will delete all of your profiles and saved movies.');
    
    if (!confirmDelete) return;

    try {
      await this.authService.deleteAccount();
      this.snackBar.open('Account successfully deleted.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error(error);
      this.snackBar.open(error.message || 'Failed to delete account.', 'Close', { duration: 5000 });
    }
  }
}
