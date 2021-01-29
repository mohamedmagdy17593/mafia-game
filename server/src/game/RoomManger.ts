import { Room } from './Room';

class RoomManager {
  rooms: { [key: string]: Room } = {};

  constructor() {}

  createRoom(name: string) {
    let newRoom = new Room(name);
    this.rooms[name] = newRoom;
    return newRoom;
  }

  getRoom(name: string) {
    if (name in this.rooms) {
      return this.rooms[name];
    }
  }
}

export default new RoomManager();
