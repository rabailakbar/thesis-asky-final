import { configureStore } from '@reduxjs/toolkit';
import topicsReducer from './topicsSlice';

export const store = configureStore({
  reducer: {
    topics: topicsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
