import { Injectable } from '@angular/core';
import { User, UserRole } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User | null = null;

  constructor() {}

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
