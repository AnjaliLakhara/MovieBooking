import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private searchService = inject(SearchService);
  private router = inject(Router);

  navTabs = [
    { label: 'Home', path: '/user/home' },
    { label: 'Hindi', path: '/user/hindi' },
    { label: 'Telugu', path: '/user/telugu' },
    { label: 'English', path: '/user/english' },
    { label: 'Korean', path: '/user/korean' },
    { label: 'Japanese', path: '/user/japanese' },
  ];

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
  onSearch(event: any) {
    this.searchService.updateSearch(event.target.value);
  }
}