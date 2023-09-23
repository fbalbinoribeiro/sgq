import { Component } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Checklist } from 'src/app/models/checklist';
import { ChecklistService } from 'src/app/services/checklist.service';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.css'],
})
export class ChecklistsComponent {
  visible = false;
  event$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  checklists$: Observable<Checklist[]> = this.event$.pipe(
    switchMap(() => this.checklistService.getAll()),
    map((checklists) => checklists.slice())
  );

  constructor(private readonly checklistService: ChecklistService) {}
}
