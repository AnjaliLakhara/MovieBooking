import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map, filter, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUserProfile$.pipe(
    filter(profile => profile !== undefined),
    take(1),
    map(profile => {
      if (profile?.role === 'admin' || profile?.email === 'admin@cinesync.com') return true;
      router.navigate(['/']);
      return false;
    })
  );
};