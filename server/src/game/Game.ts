import _ from 'lodash';

type GamePlayersRoles = 'MAFIA' | 'DOCTOR' | 'OFFICER' | 'CITIZEN';

type GameState = 'SLEEP' | 'AWAKE';

interface GamePlayer {
  id: string;
  role: GamePlayersRoles;
  select?: string; // selectPlayer
}

export class Game {
  players: GamePlayer[];
  state: GameState;

  constructor(playersIds: string[]) {
    if (playersIds.length < 4) {
      throw Error(`you should have 4 or more players to play this game`);
    }
    this.state = 'SLEEP';
    this.players = this.getRandomPlayersRoles(playersIds);
  }

  getRandomPlayersRoles(playersIds: string[]) {
    let players: GamePlayer[] = playersIds.map(id => {
      return {
        id,
        role: 'CITIZEN',
      };
    });
    players = _.shuffle(players);

    // assign 'MAFIA', 'DOCTOR', and 'OFFICER' rules
    let [player1, player2, player3] = _.shuffle(players);
    player1.role = 'MAFIA';
    player2.role = 'DOCTOR';
    player3.role = 'OFFICER';

    return players;
  }

  get mafia() {
    return this.players.find(player => player.role === 'MAFIA');
  }

  get doctor() {
    return this.players.find(player => player.role === 'DOCTOR');
  }

  get officer() {
    return this.players.find(player => player.role === 'OFFICER');
  }

  mafiaKill(playerId: string) {
    let mafia = this.mafia!;
    if (mafia.id === playerId) {
      throw Error('mafia can not kill himself');
    }
    mafia.select = playerId;
  }

  officerThink(playerId: string) {
    let officer = this.officer!;
    if (officer.id === playerId) {
      throw Error('officer can not Think of himself');
    }
    officer.select = playerId;
  }

  doctorTrait(playerId: string) {
    let doctor = this.doctor!;
    doctor.select = playerId;
  }

  checkSleepState() {
    if (this.state !== 'SLEEP') {
      return;
    }

    let mafia = this.mafia!;
    let officer = this.officer!;
    let doctor = this.doctor!;
    let isSelectionEnd = mafia.select && doctor.select && officer.select;
    if (!isSelectionEnd) {
      return;
    }

    return {
      killHappened: mafia.select !== doctor.select,
      officerKnows: mafia.id === officer.select,
    };
  }
}
