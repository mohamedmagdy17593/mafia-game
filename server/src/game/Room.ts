// import { Game } from './Game';

import { getGamePlayers } from './utils';

export interface Player {
  id: string;
  name: string;
  avatarIndex: number;
}

export type GamePlayersRoles = 'MAFIA' | 'DOCTOR' | 'OFFICER' | 'CITIZEN';

export interface GamePlayer {
  id: string;
  role: GamePlayersRoles;
  select?: string; // selectPlayer
}

interface IDLERoom {
  state: 'IDLE';
}
interface SLEEPRoom {
  state: 'SLEEP';
  players: GamePlayer[];
}
interface AWAKERoom {
  state: 'AWAKE';
  players: GamePlayer[];
}
type GameRoomState = IDLERoom | SLEEPRoom | AWAKERoom;

export class Room {
  name: string;
  adminId?: string;
  players: Player[] = [];

  gameState: GameRoomState = {
    state: 'IDLE',
  };

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

    let gameState: SLEEPRoom = {
      state: 'SLEEP',
      players: getGamePlayers(playersIds),
    };
    this.gameState = gameState;
  }
}
