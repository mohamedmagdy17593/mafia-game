import { Server, Socket } from 'socket.io';
import { GamePlayer } from '../game/Room';
import RoomManger from '../game/RoomManger';
import { getClientRoomState, getMafia } from '../game/utils';

interface MyRolePayload {
  roomName: string;
  id: string;
}

interface PlayerSelectPayload {
  roomName: string;
  playerId: string;
  selectedId: string;
}

interface GameRestartArg {
  roomName: string;
}

function gameHandlers(io: Server, socket: Socket) {
  socket.on('game:myRole', ({ roomName, id }: MyRolePayload, cb) => {
    let room = RoomManger.getRoom(roomName);
    if (!room || room.gameState.state === 'IDLE') {
      return;
    }
    let me = room.gameState.players.find(player => player.id === id);
    if (!me) {
      return;
    }
    cb(me.role);
  });

  socket.on(
    'game:player:select',
    ({ roomName, playerId, selectedId }: PlayerSelectPayload, cb) => {
      let room = RoomManger.getRoom(roomName);
      if (!room || room.gameState.state === 'IDLE') {
        return;
      }
      switch (room.gameState.state) {
        case 'SLEEP': {
          let gamePlayers = room.gameState.players;
          let player = room.gameState.players.find(
            player => player.id === playerId,
          );
          if (!player) {
            return;
          }
          player.select = selectedId;

          cb(selectedId);

          let sleepRoundState = room.checkSleepGameState();
          if (!sleepRoundState) {
            return;
          }

          let roundStateMessage: string;
          let { killHappened, officerKnows } = sleepRoundState;
          if (killHappened) {
            let mafia = getMafia(gamePlayers)!;
            let killedPlayer = room.kill(mafia.select!)!;
            let killedPlayerName = room.getPlayer(killedPlayer.id!)?.name;
            roundStateMessage = `
              ${killedPlayerName} is killed by the mafia,
              the doctor wasn't able to save him,
              and the officer ${
                officerKnows ? 'knows' : "doesn't know"
              } the mafia
            `.trim();
          } else {
            roundStateMessage = `
                No one killed by the mafia,
                the doctor was able to save him,
                and the officer ${
                  officerKnows ? 'knows' : "doesn't know"
                } the mafia
              `.trim();
          }

          // TODO: check winner
          // I think we don't need to check winner here

          room.awakeGame(roundStateMessage);

          io.to(roomName).emit('room:state', getClientRoomState(room));
          break;
        }
        case 'AWAKE': {
          let player = room.gameState.players.find(
            player => player.id === playerId,
          );
          if (!player) {
            return;
          }
          player.select = selectedId;

          /**
           * check game status
           */
          let undeadPlayers = room.gameState.players.filter(
            player => !player.isDead,
          );
          let isAllVoted = undeadPlayers.every(player => player.select);
          if (isAllVoted) {
            let h: any = {};
            let maxVoted = -1;
            let killedPlayer: GamePlayer;
            for (let player of undeadPlayers) {
              let numberOfVotes = undeadPlayers.filter(
                p => p.select === player.id,
              ).length;
              h[numberOfVotes] = (h[numberOfVotes] ?? 0) + 1;
              if (numberOfVotes > maxVoted) {
                maxVoted = numberOfVotes;
                killedPlayer = player;
              }
            }

            if (h[maxVoted] === 1) {
              // kill the player
              killedPlayer!.isDead = true;

              let mafiaPlayer = room.gameState.players.find(
                player => player.role === 'MAFIA',
              );
              let mafiaName = room.getPlayer(mafiaPlayer!.id)?.name;

              // check for winner if not sleep
              if (killedPlayer!.role === 'MAFIA') {
                // city won
                io.to(roomName).emit(
                  'game:end',
                  `City win 😃, ${mafiaName} is the mafia`,
                  room.name,
                );
              } else {
                let undeadPlayersLength = undeadPlayers.length - 1;
                if (undeadPlayersLength < 4) {
                  // city lose mafia win
                  io.to(roomName).emit(
                    'game:end',
                    `Mafia win ☠️, ${mafiaName} is the mafia`,
                    room.name,
                  );
                } else {
                  // cont.
                  let name = room.getPlayer(killedPlayer!.id)?.name;
                  let sleepMessage = `${name} is Dead, the mafia still here`;
                  room.sleepGame(sleepMessage);
                }
              }
            }
          }

          io.to(roomName).emit('room:state', getClientRoomState(room));
          break;
        }
      }
    },
  );

  socket.on('game:restart', ({ roomName }: GameRestartArg) => {
    let room = RoomManger.getRoom(roomName);
    if (!room) {
      return;
    }
    room.restart();
    io.to(roomName).emit('room:state', getClientRoomState(room));
  });
}

export default gameHandlers;
