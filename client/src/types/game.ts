export type GameState = 'SLEEP' | 'AWAKE';

export type GamePlayersRoles = 'MAFIA' | 'DOCTOR' | 'OFFICER' | 'CITIZEN';

interface GamePlayer {
  id: string;
  name: string;
  avatarIndex: number;
}

export interface Game {
  myRole: GamePlayersRoles;
  players: GamePlayer[];
  state: GameState;
}
