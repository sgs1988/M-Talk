import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AUTH_TOKEN } from '../shared/const';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(AUTH_TOKEN);
    let authReq = req.clone();

    if (token) {
      authReq = req.clone({
        headers: req.headers.set('X-Parse-Session-Token', token),
      });
    }

    return next.handle(authReq).pipe(
      catchError(({ error }: HttpErrorResponse) => {
        if (error.code === 209) {
          localStorage.removeItem(AUTH_TOKEN);
          this.router.navigate(['/login']);
        }

        return throwError(error);
      }),
    );
  }
}
