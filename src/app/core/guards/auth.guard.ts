import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map, filter, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUserProfile$.pipe(
    filter(profile => profile !== undefined), 
    take(1),
    map(profile => {
      if (profile) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};