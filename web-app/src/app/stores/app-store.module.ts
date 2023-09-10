import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppState } from './app-state';
import { hydrationMetaReducer } from './hydration/hydration.reducer';
import { SettingsEffects } from './settings/settings.effects';
import { settingsReducer } from './settings/settings.reducer';

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];

const reducers: ActionReducerMap<AppState> = {
  settings: settingsReducer,
};

const effects = [SettingsEffects];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 250,
      logOnly: false,
      autoPause: true,
    }),
  ],
  exports: [StoreModule, EffectsModule],
})
export class AppStoreModule {}
