// store.ts
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './Slices/chatSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
