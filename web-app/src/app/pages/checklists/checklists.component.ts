import { Component } from '@angular/core';
import {
  Checklist,
  ChecklistAllowedTypes,
  ChecklistCustomField,
} from 'src/app/models/checklist';
import { User, UserRole } from 'src/app/models/user';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.css'],
})
export class ChecklistsComponent {
  checklists: Checklist[] = [
    new Checklist(
      1,
      new User(1, 'Usuário 1', 'xyz@abc.com', UserRole.GENERAL),
      'Checklist 1',
      'Descrição do checklist 1',
      [
        new ChecklistCustomField(
          1,
          ChecklistAllowedTypes.CHECKBOX,
          'Descrição do campo 1'
        ),
        new ChecklistCustomField(
          2,
          ChecklistAllowedTypes.YES_NO,
          'Descrição do campo 2'
        ),
      ]
    ),
  ];

  constructor() {}
}
