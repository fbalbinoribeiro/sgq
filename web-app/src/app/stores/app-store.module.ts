import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppState } from './app-state';
import { settingsReducer } from './settings/settings.reducer';

const reducers: ActionReducerMap<AppState> = {
  settings: settingsReducer,
};

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 250,
      logOnly: false,
      autoPause: true,
    }),
  ],
  exports: [StoreModule, EffectsModule],
})
export class AppStoreModule {}
