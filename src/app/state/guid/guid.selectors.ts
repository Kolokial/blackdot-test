import { createSelector } from '@ngrx/store';
import { AppState, GuidState } from './guid.state';

export const selectGuidState = (state: AppState) => state.guid;

export const selectAllGuids = createSelector(
  selectGuidState,
  (state: GuidState) => state.guids
);
