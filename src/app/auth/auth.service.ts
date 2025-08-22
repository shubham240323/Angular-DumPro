import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


export interface LoginRequest { Email: string; password: string; }
export interface LoginResponse {
  Token: string;
  UserId: number;
  Name: string;
  Expires?: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = 'http://localhost:62402/api/Auth';
  private readonly tokenKey = 'Stoken';
  private readonly userKey  = 'SUsername';

  constructor(private http: HttpClient) {}


  login(body: LoginRequest): Observable<LoginResponse> {
  debugger;
  console.log(body);
  return this.http.post<LoginResponse>(`${this.base}/Login`, body);
}


  logout(): void {
    localStorage.removeItem('Stoken');
    localStorage.removeItem('SUsername');
  }

  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  currentUser(): { id: number; name: string; role?: string } | null {
    debugger;
    const s = localStorage.getItem(this.userKey);
    return s ? JSON.parse(s) : null;
  }
}


