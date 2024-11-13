import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authService = inject(AuthService);
  if(req.url.includes('auth/login')) return next(req);
  let newReq = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken)
  });
  return next(newReq);
};
