import { Action, createReducer, on } from '@ngrx/store';
import { ToolbarActions } from 'src/app/components/toolbar/toolbar.actions';
import { SettingsState } from './settings.interface';

const initialState: SettingsState = {
  accessibilityMode: false,
};

const reducer = createReducer(
  initialState,
  on(ToolbarActions.changeAccessibilityState, (state: SettingsState) => ({
    ...state,
    accessibilityMode: !state.accessibilityMode,
  }))
);

export const settingsReducer = (
  state: SettingsState | undefined,
  action: Action
) => reducer(state, action);
