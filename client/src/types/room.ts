export interface Player {
  id: string;
  name: string;
  isAdmin: boolean;
  avatarIndex: number;
}

interface IDLERoom {
  state: 'IDLE';
}
interface SLEEPRoom {
  state: 'SLEEP';
}
interface AWAKERoom {
  state: 'AWAKE';
}
type GameRoomState = IDLERoom | SLEEPRoom | AWAKERoom;

export interface Room {
  roomName: string;
  players: Player[];
  gameState: GameRoomState;
}
