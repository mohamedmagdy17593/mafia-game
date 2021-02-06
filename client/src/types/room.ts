export interface Player {
  id: string;
  name: string;
  isAdmin: boolean;
  connect: boolean;
  avatarIndex: number;
}

export interface GamePlayer {
  id: string;
  name: string;
  avatarIndex: number;
  isDead: boolean;
}

export interface AwakeGamePlayer extends GamePlayer {
  select?: string;
}

export interface IDLERoom {
  state: 'IDLE';
}

export interface SLEEPRoom {
  state: 'SLEEP';
  players: GamePlayer[];
}

export interface AWAKERoom {
  state: 'AWAKE';
  players: AwakeGamePlayer[];
  message: string;
}

type GameRoomState = IDLERoom | SLEEPRoom | AWAKERoom;

export interface Room {
  roomName: string;
  players: Player[];
  gameState: GameRoomState;
}
