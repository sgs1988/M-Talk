import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private baseUrl = environment.baseUrl;
  private headers: any = {
    'X-Parse-Application-Id': environment.appId,
    'X-Parse-REST-API-Key': environment.restApiKey,
  };

  constructor(private http: HttpClient) {}

  get<Type>(url: string, data?: any): Observable<Type> {
    return this.http.get<Type>(`${this.baseUrl}/${url}`, {
      headers: this.headers,
      params: data,
    });
  }

  post<Type>(url: string, data?: any): Observable<Type> {
    return this.http.post<Type>(`${this.baseUrl}/${url}`, data, {
      headers: this.headers,
    });
  }

  put<Type>(url: string, data?: any): Observable<Type> {
    return this.http.put<Type>(`${this.baseUrl}/${url}`, data, {
      headers: this.headers,
    });
  }
}
