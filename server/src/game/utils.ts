import _ from 'lodash';
import { Player } from './Player';
import { Room } from './Room';

export function getClientRoomState(room: Room) {
  console.log('room', room);

  let roomName = room.name;

  let players = room.players.map(player => {
    return {
      ...player,
      isAdmin: player.id === room.adminId,
    };
  });

  let state = room.state;

  // get game state
  let gamePlayers =
    room.game?.players.map(gamePlayer => {
      let player =
        room.players.find(player => player.id === gamePlayer.id) ?? {};
      return player;
    }) ?? [];
  let game = {
    ...room.game,
    players: gamePlayers,
  };

  return {
    roomName,
    players,
    state,
    game,
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
