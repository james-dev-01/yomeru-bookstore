import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from './facades/auth.facade';

export const adminGuard: CanActivateFn = (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  if (authFacade.usuarioEhAdmin()) {
    return true;
  }

  router.navigate(['/acesso-negado']);
  return false;
};