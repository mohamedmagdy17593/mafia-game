import { Game } from './Game';
import { Player } from './Player';

type RoomState = 'IDEL' | 'RUNNING';

export class Room {
  name: string;
  adminId?: string;
  players: Player[] = [];
  state: RoomState = 'IDEL';
  game?: Game;

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

  startGame() {
    let playersIds = this.players.map(player => player.id);
    if (playersIds.length < 4) {
      return;
    }
    this.game = new Game(playersIds);
    this.state = 'RUNNING';
  }
}
