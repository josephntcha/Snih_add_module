import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authService = inject(AuthService);
  if(req.url.includes('auth/login') 
      || req.url.includes('users/password-change') 
      || req.url.includes('/api/appointments') && req.method === 'POST'
      || req.url.includes('/api/hospitals') && !req.url.includes('specialities') && req.method === 'GET'
      || req.url.includes('/api/hospitals') && req.url.includes('specialities') && req.method === 'GET'
      || req.url.includes('/api/specialities') && req.url.includes('price') && req.method === 'GET'
      || req.url.includes('availabilities') && req.method === 'GET'
      || req.url.includes('/api/days') && req.method === 'GET'
      || req.url.includes('/api/users/doctors') && req.method === 'GET'
  ) return next(req);
  
  let newReq = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken)
  });
  return next(newReq);
};
