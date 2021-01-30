import { Server, Socket } from 'socket.io';
import RoomManger from '../game/RoomManger';

interface MyRolePayload {
  roomName: string;
  id: string;
}

function gameHandlers(io: Server, socket: Socket) {
  socket.on('game:myRole', ({ roomName, id }: MyRolePayload, cb) => {
    let room = RoomManger.getRoom(roomName);
    if (!room || room.gameState.state === 'IDLE') {
      return;
    }
    let me = room.gameState.players.find(player => player.id === id);
    if (!me) {
      return;
    }
    cb(me.role);
  });
}

export default gameHandlers;
