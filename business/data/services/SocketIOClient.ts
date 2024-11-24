import { io } from "socket.io-client";

export const SocketIOClient = io(process.env.EXPO_PUBLIC_URL, {
  transports: ["websocket"],
  reconnection: true,
  autoConnect: false,
});
