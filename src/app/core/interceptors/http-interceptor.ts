import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from '../services/loading';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.iniciar();

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      console.error(`[HTTP] Erro ${erro.status} em ${req.url}`);
      return throwError(() => erro);
    }),
    finalize(() => loading.finalizar())
  );
};