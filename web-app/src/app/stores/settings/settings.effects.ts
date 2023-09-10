import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';
import { ToolbarActions } from 'src/app/components/toolbar/toolbar.actions';
import { AppState } from '../app-state';
import { SETTINGS_FEATURE_KEY } from './settings.interface';
import { settingsSelectors } from './settings.selector';

@Injectable()
export class SettingsEffects {
  changeAccessibilityValue$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ToolbarActions.changeAccessibilityState),
        withLatestFrom(this.store.select(settingsSelectors.settingsSlice)),
        tap(([, s]) =>
          localStorage.setItem(SETTINGS_FEATURE_KEY, JSON.stringify(s))
        )
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}
