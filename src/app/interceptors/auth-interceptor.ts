import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { catchError, finalize, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from './loaderservice';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService); // Inject MessageService
  const router = inject(Router);
  const loaderService = inject(LoaderService); // inject loader service
  const token = localStorage.getItem('authToken');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
// Show loader
  loaderService.show();

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);

      // Show toast message
      messageService.add({
        // key:'global',
        severity: 'error',
        summary: 'Error',
        detail: error?.error?.message || 'Something went wrong!',
      });

      if (error.status === 401 && error?.error?.message === 'Token has expired') {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('isLoggedIn');
  messageService.add({key:'global', severity: 'warn', summary: 'Session Expired', detail: 'Please log in again.' });
  
}

      
      return throwError(() => error);
    }),
    finalize(() => {
      // Always hide loader regardless of success or error
      loaderService.hide();
    })
  );
};
