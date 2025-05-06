import { createReducer, on } from '@ngrx/store';
import { addGuid, setGuids } from './guid.actions';
import { initialGuidState } from './guid.state';

export const guidReducer = createReducer(
  initialGuidState,
  on(addGuid, (state, { guid }) => ({
    ...state,
    guids: [...state.guids, guid],
  })),
  on(setGuids, (state, { guids }) => ({
    ...state,
    guids,
  }))
);
