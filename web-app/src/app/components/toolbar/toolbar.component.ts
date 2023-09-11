import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { UserRole } from 'src/app/models/user';
import { AppState } from 'src/app/stores/app-state';
import { settingsSelectors } from 'src/app/stores/settings/settings.selector';
import { ToolbarActions } from './toolbar.actions';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
  @Input()
  title: string = '';

  accessibilityMode$ = this.store.select(
    settingsSelectors.selectAccessibilityMode
  );

  userRole$ = new BehaviorSubject<UserRole>(UserRole.ADMIN);

  UserRole = UserRole;

  constructor(private readonly store: Store<AppState>) {}

  changeAccessibilityStatus = () =>
    this.store.dispatch(ToolbarActions.changeAccessibilityState());
}
