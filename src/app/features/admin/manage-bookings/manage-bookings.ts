import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../../../core/services/booking.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-manage-bookings',
  imports: [CommonModule, MatCardModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './manage-bookings.html',
  styleUrl: './manage-bookings.css',
})
export class ManageBookings {
  bookingService = inject(BookingService);
  allBookings$ = this.bookingService.getAllBookings();

  updateStatus(bookingId: string, newStatus: any) {
    this.bookingService.updateStatus(bookingId, newStatus);
  }
}
