import { nanoid } from 'nanoid';

interface UserRoom {
  roomName: string;
  userRoomId: string;
}

interface User {
  token: string;
  rooms: UserRoom[]; // array of rooms ids
}

interface CreateUserArg {
  roomName: string;
  userRoomId: string;
}

interface GetUserRoomArg {
  token: string;
  roomName: string;
}

interface AddRoomToUserArg {
  roomName: string;
  userRoomId: string;
  token: string;
}

class UserManager {
  users: User[] = [];

  createUser() {
    let token = nanoid();
    let user: User = { token, rooms: [] };
    this.users.push(user);
    return token;
  }

  addRoomToUser({ roomName, userRoomId, token }: AddRoomToUserArg) {
    let user = this.users.find(user => user.token === token);
    if (!user) {
      return;
    }
    user.rooms.push({ roomName, userRoomId });
  }

  getUserRoom({ token, roomName }: GetUserRoomArg) {
    let user = this.users.find(user => user.token === token);
    if (!user) {
      return;
    }
    let room = user.rooms.find(room => room.roomName === roomName);
    if (!room) {
      return;
    }
    return room;
  }
}

export default new UserManager();
