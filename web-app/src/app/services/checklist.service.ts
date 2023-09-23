import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Checklist } from '../models/checklist';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Checklist[]> {
    return this.http.get<Checklist[]>(`${environment.baseUrl}/checklists`);
  }

  update(id: string, checklist: Checklist): Observable<Checklist> {
    return this.http.put<Checklist>(
      `${environment.baseUrl}/checklist-update?id=${id}`,
      checklist
    );
  }
}
