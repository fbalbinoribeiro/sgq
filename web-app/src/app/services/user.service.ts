import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  create(user: User): Observable<User> {
    return this.http.post<User>(`${environment.baseUrl}/user-create`, user);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseUrl}/users`);
  }

  update(id: string, user: User): Observable<User> {
    return this.http.put<User>(
      `${environment.baseUrl}/user-update?id=${id}`,
      user
    );
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete(`${environment.baseUrl}/user-delete?id=${id}`)
      .pipe(map(() => true));
  }
}
