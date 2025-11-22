import { io } from "socket.io-client";

const BACK_URI = import.meta.env.VITE_BACK_URI || 'http://localhost:3000';

const socket = io(BACK_URI, {
  autoConnect: true,
});

export default socket;