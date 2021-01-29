import { Room } from './Room';

class RoomManager {
  rooms: { [key: string]: Room } = {};

  constructor() {}

  createRoom(name: string) {
    this.rooms[name] = new Room();
  }
}

export default new RoomManager();
