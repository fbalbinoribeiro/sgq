import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './stores/app-state';
import { settingsSelectors } from './stores/settings/settings.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  accessibilityMode$ = this.store.select(
    settingsSelectors.selectAccessibilityMode
  );
  title = 'web-app';

  constructor(private readonly store: Store<AppState>) {}
}
