import { Game } from './game';

export interface Player {
  id: string;
  name: string;
  isAdmin: boolean;
  avatarIndex: number;
}

export type RoomState = 'IDEL' | 'RUNNING';

export interface Room {
  roomName: string;
  players: Player[];
  state: RoomState;
  game: Game;
}
