import { Action, ActionReducer } from '@ngrx/store';
import { HydrationActions } from 'src/app/services/hydration.actions';
import { AppState } from '../app-state';

export const isHydrateSuccess = (
  action: Action
): action is ReturnType<typeof HydrationActions.hydrateSuccess> =>
  action.type === HydrationActions.hydrateSuccess.type;

export const hydrationMetaReducer =
  (reducer: ActionReducer<AppState>): ActionReducer<AppState> =>
  (state: AppState | undefined, action) => {
    if (isHydrateSuccess(action)) {
      return action.state;
    } else {
      return reducer(state, action);
    }
  };
