import { createAction, createReducer } from '@reduxjs/toolkit';

export interface activeScreenInterface {
  clientAppVersion: string;
  timezone: string;
  boxId: string;
  countryCode: string;
  sessionId: string;
  userId: number;
  deviceSubtype: string;
  deviceTypeDetails: {
    name: string;
    image: string;
    description: string;
  };
  loginTime: BigInt;
  deviceId: number;
  isCurrentDevice: boolean;
  loginMode: number;
}

let initialState: activeScreenInterface[] = [];

export const addScreensAction = createAction<activeScreenInterface[]>(
  'activescreens/addscreens'
);

export const removeScreenAction = createAction<
  activeScreenInterface['sessionId']
>('activescreens/removescreen');

export const activescreensReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addScreensAction, (state, { payload }) => {
      state.push(...payload);
    })
    .addCase(removeScreenAction, (state, { payload }) => {
      state = state.filter((screen) => screen.sessionId !== payload);
      return state;
    })
    .addDefaultCase(() => {});
});
