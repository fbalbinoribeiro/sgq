import { createActionGroup, emptyProps } from '@ngrx/store';

export const ToolbarActions = createActionGroup({
  source: 'Toolbar',
  events: {
    'Change Accessibility State': emptyProps(),
  },
});
