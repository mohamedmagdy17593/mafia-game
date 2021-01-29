import { Server, Socket } from 'socket.io';
import { Player } from '../game/Player';
import RoomManger from '../game/RoomManger';
import {
  isAvatarIndexUniq,
  getClientRoomState,
  getUniqueAvatarIndex,
} from '../game/utils';
import { getRoomName } from '../utils/room';

interface JoinPayload {
  roomName: string;
  userName: string;
}

interface SelectAvatarPayload {
  playerId: string;
  roomName: string;
  avatarIndex: number;
}

function roomHandlers(io: Server, socket: Socket) {
  socket.on('room:create', cb => {
    let roomName = getRoomName();
    RoomManger.createRoom(roomName);
    cb(roomName);
  });

  socket.on('room:join', async ({ roomName, userName }: JoinPayload, cb) => {
    let room = RoomManger.getRoom(roomName);
    if (!room) {
      return;
    }
    let newAvatarIndex = getUniqueAvatarIndex(room.players);
    let player = new Player(userName, newAvatarIndex);
    if (!room.adminId) {
      room.adminId = player.id;
    }
    room.addPlayer(player);
    await socket.join(roomName);
    io.to(roomName).emit('room:state', getClientRoomState(room));
    cb(player.id);
  });

  socket.on(
    'room:selectAvatar',
    ({ playerId, roomName, avatarIndex }: SelectAvatarPayload) => {
      let room = RoomManger.getRoom(roomName);
      if (!room) {
        return;
      }
      let player = room.getPlayer(playerId);
      if (!player) {
        return;
      }
      if (!isAvatarIndexUniq(room.players, avatarIndex)) {
        return;
      }
      player.avatarIndex = avatarIndex;
      io.to(roomName).emit('room:state', getClientRoomState(room));
    },
  );
}

export default roomHandlers;
