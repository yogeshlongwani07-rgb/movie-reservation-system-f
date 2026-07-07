import { io } from "socket.io-client";

// The backend's http server (src/socket/socket.js) attaches Socket.IO to the
// same port that Express listens on (default 3000), NOT to the /api/v1
// REST prefix. That's why this is a plain origin, unlike services/api.js
// which points at http://localhost:3000/api/v1.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

let socket = null;

/**
 * Lazily creates (or returns the existing) Socket.IO client instance.
 * We don't auto-connect on import because the seat-selection screen is the
 * only place that needs a live connection - every other page should stay
 * socket-free.
 */
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true, // mirrors axios's withCredentials in services/api.js
      autoConnect: false, // caller decides when to open the connection
      transports: ["websocket"],
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
  }
}
