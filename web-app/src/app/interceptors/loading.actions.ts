import { createActionGroup, emptyProps } from '@ngrx/store';

export const LoadingActions = createActionGroup({
  source: 'Loading',
  events: {
    'start loading': emptyProps(),
    'stop loading': emptyProps(),
  },
});
