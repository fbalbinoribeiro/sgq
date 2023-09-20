import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.interface';

const settingsSlice = createFeatureSelector<SettingsState>('settings');
const selectAccessibilityMode = createSelector(
  settingsSlice,
  (state: SettingsState) => state.accessibilityMode
);
const isLoading = createSelector(
  settingsSlice,
  (state: SettingsState) => state.isLoading
);

export const settingsSelectors = {
  settingsSlice,
  selectAccessibilityMode,
  isLoading,
};
