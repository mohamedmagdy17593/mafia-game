import { io } from 'socket.io-client';

let user: any = null;

try {
  let gameUser = window.localStorage.getItem('game:user');
  user = gameUser ? JSON.parse(gameUser) : null;
} catch {}

export const socket = io('/', {
  query: {
    token: user?.token,
  },
});
