import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux/store";
import { createSocketClient } from "@/business/data/services/SocketIOClient";

const socket = createSocketClient(process.env.EXPO_PUBLIC_URL);

interface RealtimeDateState {
  connected: boolean;
}

const initialState: RealtimeDateState = {
  connected: false,
};

const realtimeDataSlice = createSlice({
  name: "realtimeData",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});

const initializeSocket = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(realtimeDataSlice.actions.setConnected(false));

    try {
      console.log("Connecting to socket server: ");
      socket.connect();

      socket.on("connect", () => {
        console.log("Connected to socket server");
        dispatch(realtimeDataSlice.actions.setConnected(true));
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
        dispatch(realtimeDataSlice.actions.setConnected(false));
      });

      socket.on("error", (error: any) => {
        console.error("Error connecting to socket server", error);
        dispatch(realtimeDataSlice.actions.setConnected(false));
      });
    } catch (error) {
      console.error("Error connecting to socket server", error);
    }
  };
};

export const realtimeDataActions = {
  ...realtimeDataSlice.actions,
  initializeSocket,
};

export const realtimeDataReducer = realtimeDataSlice.reducer;
