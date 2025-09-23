import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService); // Inject MessageService
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);

      // Show toast message
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error?.error?.message || 'Something went wrong!',
      });

      // // Optional: redirect to login if 401
      // if (error.status === 401||error.status === 400||error.status ===500) {
      //     router.navigate(['/auth/login']);
      // }

      return throwError(() => error);
    })
  );
};
