import {createContext, useContext} from 'react';
import io, {Socket} from 'socket.io-client';

interface Context {
  socket: Socket;
}

// const socket = io('http://localhost:4000');
const socket = io('https://marivote-express.vercel.app:4000');

const SocketContext = createContext<Context>({
  socket,
});

export const useSocket = () => useContext(SocketContext);
