// import { Game } from './Game';

import { getDoctor, getGamePlayers, getMafia, getOfficer } from './utils';

export interface Player {
  id: string;
  name: string;
  avatarIndex: number;
}

export type GamePlayersRoles = 'MAFIA' | 'DOCTOR' | 'OFFICER' | 'CITIZEN';

export interface GamePlayer {
  id: string;
  role: GamePlayersRoles;
  isDead: boolean;
  select?: string; // selectPlayer
}

interface IDLERoom {
  state: 'IDLE';
}
interface SLEEPRoom {
  state: 'SLEEP';
  players: GamePlayer[];
  message?: string;
}
interface AWAKERoom {
  state: 'AWAKE';
  players: GamePlayer[];
  message: string;
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

  checkSleepGameState() {
    let { gameState } = this;
    if (gameState.state !== 'SLEEP') {
      return;
    }

    let mafia = getMafia(gameState.players)!;
    let doctor = getDoctor(gameState.players)!;
    let officer = getOfficer(gameState.players)!;

    let isSelectionEnd = mafia.select && doctor.select && officer.select;
    if (!isSelectionEnd) {
      return;
    }

    return {
      killHappened: mafia.select !== doctor.select,
      officerKnows: mafia.id === officer.select,
    };
  }

  kill(playerId: string) {
    let { gameState } = this;
    if (gameState.state === 'IDLE') {
      return;
    }
    let player = gameState.players.find(player => player.id === playerId);
    if (!player) {
      return;
    }
    player.isDead = true;
    return player;
  }

  awakeGame(message: string) {
    let { gameState } = this;
    if (gameState.state === 'SLEEP') {
      Object.assign(gameState, {
        state: 'AWAKE',
        message,
        players: gameState.players.map(player => ({
          ...player,
          select: undefined,
        })),
      });
    }
  }

  sleepGame(message: string) {
    let { gameState } = this;
    if (gameState.state === 'AWAKE') {
      Object.assign(gameState, {
        state: 'SLEEP',
        message,
        players: gameState.players.map(player => ({
          ...player,
          select: undefined,
        })),
      });
    }
  }

  restart() {
    this.gameState = {
      state: 'IDLE',
    };
  }
}
