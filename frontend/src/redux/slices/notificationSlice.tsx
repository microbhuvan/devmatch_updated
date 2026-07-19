import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface NotificationState {
  pendingRequestCount: number;
  toasts: Toast[];
}

const initialState: NotificationState = {
  pendingRequestCount: 0,
  toasts: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Toast reducers
    addToast: {
      reducer: (
        state,
        action: PayloadAction<{ id: string; type: ToastType; message: string }>,
      ) => {
        state.toasts.push({
          id: action.payload.id,
          type: action.payload.type,
          message: action.payload.message,
        });
      },
      prepare: (message: string, type: ToastType = "info") => {
        return {
          payload: {
            id: nanoid(),
            message,
            type,
          },
        };
      },
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload,
      );
    },

    // Pending request count reducers
    setPendingRequestCount: (state, action: PayloadAction<number>) => {
      state.pendingRequestCount = action.payload;
    },
    incrementPendingRequestCount: (state) => {
      state.pendingRequestCount += 1;
    },
    decrementPendingRequestCount: (state) => {
      if (state.pendingRequestCount > 0) {
        state.pendingRequestCount -= 1;
      }
    },
    clearNotifications: (state) => {
      state.pendingRequestCount = 0;
    },
  },
});

export const {
  addToast,
  removeToast,
  setPendingRequestCount,
  incrementPendingRequestCount,
  decrementPendingRequestCount,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
