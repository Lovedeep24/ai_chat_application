import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
};

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// ✅ Initial state
const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

// ✅ Redux slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addMessage, clearMessages, setLoading, setError } = chatSlice.actions;
export default chatSlice.reducer;
