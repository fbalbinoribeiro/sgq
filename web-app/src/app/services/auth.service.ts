import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  hasAccess() {
    return true;
  }

  isAdmin() {
    return true;
  }
}
