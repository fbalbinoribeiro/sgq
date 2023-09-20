import { Action, createReducer, on } from '@ngrx/store';
import { ToolbarActions } from 'src/app/components/toolbar/toolbar.actions';
import { LoadingActions } from 'src/app/interceptors/loading.actions';
import { SettingsState } from './settings.interface';

const initialState: SettingsState = {
  accessibilityMode: false,
  isLoading: false,
};

const reducer = createReducer(
  initialState,
  on(ToolbarActions.changeAccessibilityState, (state: SettingsState) => ({
    ...state,
    accessibilityMode: !state.accessibilityMode,
  })),
  on(LoadingActions.startLoading, (state: SettingsState) => ({
    ...state,
    isLoading: true,
  })),
  on(LoadingActions.stopLoading, (state: SettingsState) => ({
    ...state,
    isLoading: false,
  }))
);

export const settingsReducer = (
  state: SettingsState | undefined,
  action: Action
) => reducer(state, action);
