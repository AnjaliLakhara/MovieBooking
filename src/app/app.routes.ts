import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layout/user-layout/user-layout';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';
import { Profile } from './features/user-profile/profile/profile';

import { AuthComponent } from './features/auth/auth';
import { HomeComponent } from './features/browse/home/home';
import { ManageMoviesComponent } from './features/admin/manage-movies/manage-movies';
import { ManageGenresComponent } from './features/admin/manage-genres/manage-genres';
import { SeatLayoutComponent } from './features/booking/seat-layout/seat-layout';
import { HotlistDetails } from './features/user-profile/hotlists/hotlist-details/hotlist-details';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { ManageBookings } from './features/admin/manage-bookings/manage-bookings';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent, title: 'Login to CineSync' },
   

  { 
    path: 'user', 
    component: UserLayoutComponent, 
    canActivate: [authGuard], 
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'profile', component: Profile, title: 'My Profile' },
      { path: 'watchlist/:id', component: HotlistDetails, title: 'My Watchlist' },
      { path: 'book/:movieId', component: SeatLayoutComponent, title: 'Select Seats' },
      { path: ':lang', component: HomeComponent, title: 'CineSync - Movies' } 
    ]
  },
{
  path: 'admin', 
    component: AdminLayoutComponent, 
    canActivate: [adminGuard],
    children: [
      // FIX 1: Added default redirect so /admin loads the dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
      { path: 'dashboard', component: Dashboard, title: 'Admin Dashboard' }, 
      { path: 'manage-movies', component: ManageMoviesComponent, title: 'Admin - Add Movie' },
      
      // FIX 2: Added the Edit Movie route that expects an ID in the URL
      { path: 'manage-movies/:id', component: ManageMoviesComponent, title: 'Admin - Edit Movie' },
      
      { path: 'manage-genres', component: ManageGenresComponent, title: 'Admin - Genres' },
      { path: 'manage-bookings', component: ManageBookings, title: 'Admin - Bookings' }
    ]
  },

  { path: '**', redirectTo: 'user' }
];