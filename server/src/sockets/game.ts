import { Server, Socket } from 'socket.io';
import { Player } from '../game/Player';
import RoomManger from '../game/RoomManger';
import {
  isAvatarIndexUniq,
  getClientRoomState,
  getUniqueAvatarIndex,
} from '../game/utils';
import { getRoomName } from '../utils/room';

interface MyRolePayload {
  roomName: string;
  id: string;
}

function gameHandlers(io: Server, socket: Socket) {
  socket.on('game:myRole', ({ roomName, id }: MyRolePayload, cb) => {
    let room = RoomManger.getRoom(roomName);
    if (!room || !room.game) {
      return;
    }
    let me = room.game.players.find(player => player.id === id);
    if (!me) {
      return;
    }
    cb(me.role);
  });
}

export default gameHandlers;
