// interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    debugger;
    console.log("inside intercept");
    const skipAuth = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

    const token = this.auth.getToken();
    const authReq = (!skipAuth && token)? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }): req;

    return next.handle(authReq).pipe(
      catchError((err: any) => {
        debugger;
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            this.auth.logout(); 
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
          }
        }
        return throwError(() => err);
      })
    );  
  }
}
