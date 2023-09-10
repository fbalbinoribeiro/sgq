import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { AppState } from '../stores/app-state';
import { SETTINGS_FEATURE_KEY } from '../stores/settings/settings.interface';
import { HydrationActions } from './hydration.actions';

@Injectable({
  providedIn: 'root',
})
export class HydrationService {
  constructor(private readonly store: Store<AppState>) {}

  async hydrateStore() {
    const oldState = await firstValueFrom(this.store.select((s) => s));

    const settingsStorage = localStorage.getItem(SETTINGS_FEATURE_KEY);
    const settings = settingsStorage
      ? JSON.parse(settingsStorage)
      : oldState.settings;

    const newState: AppState = {
      settings,
    };

    this.store.dispatch(HydrationActions.hydrateSuccess({ state: newState }));
  }
}
