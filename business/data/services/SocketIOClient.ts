import { io } from "socket.io-client";

export const createSocketClient = (baseUrl?: string) => {
  return io(baseUrl, {
    transports: ["websocket"],
    reconnection: true,
    autoConnect: false,
    extraHeaders: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmJjNGIwYTRhNzIxMmRiNjA0YzUxM2IiLCJlbWFpbCI6InNzdG9ubjI1MDFAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMDgkMHZ1UHVjUkgxR053aDZoZzh3OW9UZVdLTEd3RWR2elRmbGRySkR2Mld6cVhneWZQbDVVWmUiLCJpYXQiOjE3MzIzNzcxNTQsImV4cCI6MTczMjU0OTk1NH0.iFMWccLlzTL6m6NwqupM2r9yKp6Qj5beXDxTBQMfjc0",
    },
  });
};
