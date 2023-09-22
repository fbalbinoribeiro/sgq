import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { User, UserRole } from '../models/user';
import { environment } from 'src/environments/environment';

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
        tap(({ user }) => (this.currentUser = user))
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
}
