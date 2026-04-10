import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule , Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';


@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterModule, CommonModule, MatIconModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
