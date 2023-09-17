import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/user';

const baseUrl = `https://sgq20230912.azurewebsites.net/api`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  create(user: User): Observable<User> {
    return this.http.post<User>(`${baseUrl}/user-create`, user);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}/users`);
  }

  update(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${baseUrl}/user-update?id=${id}`, user);
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete(`${baseUrl}/user-update?id=${id}`)
      .pipe(map(() => true));
  }
}
