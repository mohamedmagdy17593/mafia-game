import _ from 'lodash';
import { nanoid } from 'nanoid';
import { GamePlayer, Player, Room } from './Room';

export function creatPlayer({
  name,
  avatarIndex,
}: {
  name: string;
  avatarIndex: number;
}) {
  let player: Player = {
    id: nanoid(),
    name,
    avatarIndex,
  };
  return player;
}

interface ClientGamePlayers {
  id: string;
  name: string;
  avatarIndex: number;
  isDead: boolean;
}

export function getClientRoomState(room: Room) {
  // console.log('room', room);

  let roomName = room.name;

  let players = room.players.map(player => {
    return {
      ...player,
      isAdmin: player.id === room.adminId,
    };
  });

  let gamePlayers: ClientGamePlayers[] | undefined;
  if (room.gameState.state !== 'IDLE') {
    gamePlayers = room.gameState.players.map(({ id, isDead, select }) => {
      let player = room.players.find(player => player.id === id)!;
      return {
        ...player,
        isDead,
        ...(room.gameState.state === 'AWAKE' && {
          select,
        }),
      };
    });
  }

  let gameState = {
    ...room.gameState,
    ...(gamePlayers && { players: gamePlayers }),
    ...((room.gameState.state === 'AWAKE' ||
      room.gameState.state === 'SLEEP') && {
      message: room.gameState.message,
    }),
  };

  return {
    roomName,
    players,
    gameState,
  };
}

export const avatarsLength = 20;

export const avatarsIndexArray = Array.from({ length: 20 }, (_, i) => i);

export function getUniqueAvatarIndex(players: Player[]) {
  let restAvatarsIndex = _.difference(
    avatarsIndexArray,
    players.map(player => player.avatarIndex),
  );
  let index = _.sample(restAvatarsIndex) ?? _.sample(avatarsIndexArray);
  return index as number;
}

export function isAvatarIndexUniq(players: Player[], avatarIndex: number) {
  return !players.map(player => player.avatarIndex).includes(avatarIndex);
}

export function getGamePlayers(playersIds: string[]) {
  let players: GamePlayer[] = playersIds.map(id => {
    return {
      id,
      isDead: false,
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

export function getMafia(players: GamePlayer[]) {
  return players.find(player => player.role === 'MAFIA');
}

export function getDoctor(players: GamePlayer[]) {
  return players.find(player => player.role === 'DOCTOR');
}

export function getOfficer(players: GamePlayer[]) {
  return players.find(player => player.role === 'OFFICER');
}
