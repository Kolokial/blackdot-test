import { createAction, props } from '@ngrx/store';

export const addGuid = createAction(
  '[GUID] Add Guid',
  props<{ guid: string }>()
);
export const setGuids = createAction(
  '[GUID] Set Guids',
  props<{ guids: string[] }>()
);
