import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { HydrationService } from './services/hydration.service';
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
  isLoading$ = this.store.select(settingsSelectors.isLoading);

  title = 'SGQ';

  constructor(
    private readonly store: Store<AppState>,
    private readonly hydrationService: HydrationService
  ) {
    this.hydrationService.hydrateStore();
  }
}
