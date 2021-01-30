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

export function getClientRoomState(room: Room) {
  console.log('room', room);

  let roomName = room.name;

  let players = room.players.map(player => {
    return {
      ...player,
      isAdmin: player.id === room.adminId,
    };
  });

  let gameState = room.gameState;

  // get game state
  // let gamePlayers =
  //   room.gameState?.players.map(gamePlayer => {
  //     let player =
  //       room.players.find(player => player.id === gamePlayer.id) ?? {};
  //     return player;
  //   }) ?? [];
  // let game = {
  //   ...room.game,
  //   players: gamePlayers,
  // };

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
