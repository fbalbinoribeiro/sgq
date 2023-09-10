import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AppState } from '../stores/app-state';

export const HydrationActions = createActionGroup({
  source: 'Hydration Service',
  events: {
    'Hydrate Success': props<{ state: AppState }>(),
    'Hydrate Failed': emptyProps(),
  },
});
