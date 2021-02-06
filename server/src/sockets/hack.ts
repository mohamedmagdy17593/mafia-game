import { Server, Socket } from 'socket.io';
import RoomManger from '../game/RoomManger';

function hackHandlers(io: Server, socket: Socket) {
  socket.on('hack:room', ({ roomName }, cb) => {
    let room = RoomManger.getRoom(roomName);
    if (!room) {
      return;
    }
    cb(room);
  });
}

export default hackHandlers;
