import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  if (authService.hasAccess()) {
    return true;
  }

  return router.navigate(['/login']);
};
