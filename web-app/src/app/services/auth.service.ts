import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserRole } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User | null = null;
  currentToken: string | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  signIn(email: string, password: string) {
    return this.http
      .post<{ token: string; user: User }>(`${environment.baseUrl}/sign-in`, {
        email,
        password,
      })
      .pipe(
        tap(({ token }) => (this.currentToken = token)),
        tap(({ user }) => (this.currentUser = user)),
        tap(({ token, user }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

  signOut() {
    this.currentUser = null;
    this.currentToken = null;
    this.router.navigate(['/login']);
  }

  hasAccess() {
    return this.currentUser !== null;
  }

  isAdmin() {
    return this.currentUser?.role === UserRole.ADMIN;
  }

  isManager() {
    return this.currentUser?.role === UserRole.MANAGER;
  }

  getSavedToken() {
    return localStorage.getItem('token');
  }

  getSavedUser() {
    return JSON.parse(localStorage.getItem('user') ?? '{}');
  }

  autoSignIn() {
    const token = this.getSavedToken();
    const user = this.getSavedUser();

    if (token && user) {
      this.currentToken = token;
      this.currentUser = user;
      this.router.navigate(['/home']);
    }
  }
}
