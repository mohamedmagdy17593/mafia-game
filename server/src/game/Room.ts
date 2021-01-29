import { Player } from './Player';

type RoomState = 'IDEL' | 'RUNNING';

export class Room {
  name: string;
  adminId?: string;
  players: Player[] = [];
  state: RoomState = 'IDEL';

  constructor(name: string) {
    this.name = name;
  }

  isEmpty() {
    return this.players.length === 0;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  getPlayer(id: string) {
    return this.players.find(player => player.id === id);
  }
}
