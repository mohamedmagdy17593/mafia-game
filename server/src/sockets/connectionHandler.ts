import { Server, Socket } from 'socket.io';
import RoomManger from '../game/RoomManger';

function connectionHandler(io: Server, socket: Socket) {
  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
  });
}

export default connectionHandler;
