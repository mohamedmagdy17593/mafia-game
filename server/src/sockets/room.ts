import { Server, Socket } from 'socket.io';
import RoomManger from '../game/RoomManger';
import { getRoomName } from '../utils/room';

function roomHandlers(io: Server, socket: Socket) {
  socket.on('room:create', cb => {
    let roomName = getRoomName();
    RoomManger.createRoom(roomName);
    cb(roomName);
  });
}

export default roomHandlers;
