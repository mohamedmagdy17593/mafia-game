import { Server, Socket } from 'socket.io';
import RoomManger from '../game/RoomManger';
import UserManager from '../game/UserManager';
import { getClientRoomState } from '../game/utils';

function connectionHandler(io: Server, socket: Socket & { token?: string }) {
  let token = (socket.handshake.query as any).token;
  socket.token = token;

  /**
   * on socket connect
   **/
  let users = UserManager.getUser({ token });

  // join socket rooms
  users?.rooms.forEach(room => {
    socket.join(room.roomName);
  });

  // connect player to rooms
  users?.rooms.forEach(room => {
    let gameRoom = RoomManger.getRoom(room.roomName);
    if (!gameRoom) {
      return;
    }

    let player = gameRoom.players.find(player => player.id === room.userRoomId);
    if (!player) {
      return;
    }

    player.connect = true;

    io.to(room.roomName).emit('room:state', getClientRoomState(gameRoom));
  });

  /**
   * on socket disconnect
   **/
  socket.on('disconnect', () => {
    let users = UserManager.getUser({ token });

    // leave socket rooms
    users?.rooms.forEach(room => {
      socket.leave(room.roomName);
    });

    // disconnect player to rooms
    users?.rooms.forEach(room => {
      let gameRoom = RoomManger.getRoom(room.roomName);
      if (!gameRoom) {
        return;
      }

      let player = gameRoom.players.find(
        player => player.id === room.userRoomId,
      );
      if (!player) {
        return;
      }

      player.connect = false;

      io.to(room.roomName).emit('room:state', getClientRoomState(gameRoom));
    });
  });
}

export default connectionHandler;
