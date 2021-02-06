import { Server, Socket } from 'socket.io';
import RoomManger from '../game/RoomManger';
import UserManager from '../game/UserManager';
import {
  isAvatarIndexUniq,
  getClientRoomState,
  getUniqueAvatarIndex,
  creatPlayer,
} from '../game/utils';
import { getRoomName } from '../utils/room';

interface JoinPayload {
  token?: string;
  roomName: string;
  userName?: string;
}

interface SelectAvatarPayload {
  playerId: string;
  roomName: string;
  avatarIndex: number;
}

interface GameStartPayload {
  roomName: string;
}

function roomHandlers(io: Server, socket: Socket) {
  socket.on('room:create', cb => {
    let roomName = getRoomName();
    RoomManger.createRoom(roomName);
    cb(roomName);
  });

  socket.on(
    'room:join',
    async ({ token, roomName, userName }: JoinPayload, cb) => {
      let room = RoomManger.getRoom(roomName);
      if (!room) {
        return;
      }

      if (token) {
        let userRoom = UserManager.getUserRoom({ token, roomName });
        if (userRoom) {
          await socket.join(roomName);
          io.to(roomName).emit('room:state', getClientRoomState(room));
          return cb(userRoom.userRoomId, token);
        }
      }

      if (!userName) {
        return cb(null);
      }

      let newAvatarIndex = getUniqueAvatarIndex(room.players);
      let player = creatPlayer({ name: userName, avatarIndex: newAvatarIndex });
      if (!room.adminId) {
        room.adminId = player.id;
      }

      // add this new player to the room
      room.addPlayer(player);
      // add this user to app users
      if (!token) {
        token = UserManager.createUser();
      }
      UserManager.addRoomToUser({ userRoomId: player.id, roomName, token });

      // join to the socket room
      await socket.join(roomName);
      io.to(roomName).emit('room:state', getClientRoomState(room));
      cb(player.id, token);
    },
  );

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

  socket.on('room:gameStart', ({ roomName }: GameStartPayload) => {
    let room = RoomManger.getRoom(roomName);
    if (!room) {
      return;
    }
    room.startGame();
    io.to(roomName).emit('room:state', getClientRoomState(room));
  });
}

export default roomHandlers;
