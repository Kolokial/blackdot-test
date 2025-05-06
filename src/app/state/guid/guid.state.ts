export interface GuidState {
  guids: string[];
}

export interface AppState {
  guid: GuidState;
}

export const initialGuidState: GuidState = {
  guids: [],
};
