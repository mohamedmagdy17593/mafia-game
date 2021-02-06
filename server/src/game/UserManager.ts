import { nanoid } from 'nanoid';

interface UserRoom {
  roomName: string;
  userRoomId: string;
}

interface User {
  token: string;
  rooms: UserRoom[]; // array of rooms ids
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

interface GetUserRoomsArg {
  token: string;
}

class UserManager {
  users: User[] = [];

  createUser(token?: string) {
    if (!token) {
      token = nanoid();
    }
    let user: User = { token, rooms: [] };
    this.users.push(user);
    return [token, user] as [string, User];
  }

  addRoomToUser({ roomName, userRoomId, token }: AddRoomToUserArg) {
    let user = this.users.find(user => user.token === token);
    if (!user) {
      [, user] = this.createUser(token);
    }
    user!.rooms.push({ roomName, userRoomId });
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

  getUser({ token }: GetUserRoomsArg) {
    let user = this.users.find(user => user.token === token);
    return user;
  }
}

export default new UserManager();
