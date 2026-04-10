import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { MovieService } from '../../../core/services/movie.service';
import { MatSnackBar } from '@angular/material/snack-bar';


interface Seat { id: string; status: 'available' | 'booked' | 'selected'; price: number; }

@Component({
  selector: 'app-seat-layout',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './seat-layout.html',
  styleUrls: ['./seat-layout.css']
})
export class SeatLayoutComponent {
  private bookingService = inject(BookingService);
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  movieId: string = '';
  movieTitle: string = 'Loading...';

  rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  seats: Seat[][] = this.rows.map(row => 
    this.cols.map(col => ({
      id: `${row}${col}`,

      status: Math.random() > 0.8 ? 'booked' : 'available',
      price: row === 'A' || row === 'B' ? 450 : 250 
    }))
  );

  selectedSeats: Seat[] = [];

  get totalPrice(): number {
    return this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }

  toggleSeat(seat: Seat): void {
    if (seat.status === 'booked') return;
    
    if (seat.status === 'selected') {
      seat.status = 'available';
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      seat.status = 'selected';
      this.selectedSeats.push(seat);
    }
  }
  
  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('movieId') || '';
    this.movieService.getMovieById(this.movieId).subscribe(m => {
      if(m) this.movieTitle = m.title;
    });
  }

 async proceedToPay(): Promise<void> {
    if (this.selectedSeats.length === 0) return;

    try {
      const seatIds = this.selectedSeats.map(s => s.id);
      
      await this.bookingService.createBooking({
        movieId: this.movieId,
        movieTitle: this.movieTitle,
        seats: seatIds,
        totalPrice: this.totalPrice
      });

      this.snackBar.open('Booking requested! Awaiting admin approval.', 'Close', { duration: 4000 });
      this.router.navigate(['/user/profile']); 
      
    } catch (error) {
      this.snackBar.open('Error creating booking.', 'Close', { duration: 3000 });
    }
  }
}