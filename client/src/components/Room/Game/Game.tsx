/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { useRoom } from '../Room';
import SleepGame from './SleepGame/SleepGame';
import AwakeGame from './AwakeGame/AwakeGame';
import EndGameMessage from './EndGameMessage/EndGameMessage';
import { socket } from 'utils/socket';
import { GamePlayersRoles } from 'types/game';

function Game() {
  let [playerRole, setPlayerRole] = useState<GamePlayersRoles | null>(null);
  let [endGameMessage, setEndGameMessage] = useState<null | string>(null);

  let { me, roomName, state } = useRoom();
  let { room } = state;
  let { gameState } = room!;

  useEffect(() => {
    let handler = (message: string, serverRoomName: string) => {
      if (serverRoomName === roomName) {
        setEndGameMessage(message);
      }
    };
    socket.on('game:end', handler);
    return () => {
      socket.off('game:end', handler);
    };
  }, [me?.id, roomName]);

  useEffect(() => {
    socket.emit(
      'game:myRole',
      { roomName, id: me?.id },
      (role: GamePlayersRoles) => {
        setPlayerRole(role);
      },
    );
  }, [me?.id, roomName]);

  let playerRoleBannerUi =
    playerRole &&
    (playerRole === 'MAFIA' ? (
      <Alert type="warning" showIcon={false} message="🦹‍♂️ You are the Mafia" />
    ) : playerRole === 'DOCTOR' ? (
      <Alert type="success" showIcon={false} message="👩‍⚕️ You are the Doctor" />
    ) : playerRole === 'OFFICER' ? (
      <Alert type="success" showIcon={false} message="👮 You are the Officer" />
    ) : playerRole === 'CITIZEN' ? (
      <Alert type="info" showIcon={false} message="👨‍💼 You are a Citizen" />
    ) : null);

  if (gameState.state === 'SLEEP') {
    let meGamePlayer = gameState.players.find(player => player.id === me!.id);
    return (
      <div css={{ padding: 12, maxWidth: 1200, margin: '0 auto' }}>
        {playerRoleBannerUi}
        {meGamePlayer?.isDead && (
          <Alert
            type="warning"
            css={{ marginTop: 12 }}
            showIcon={false}
            message="You Dead"
          />
        )}
        <SleepGame playerRole={playerRole} game={gameState} />
      </div>
    );
  }

  if (gameState.state === 'AWAKE') {
    let meGamePlayer = gameState.players.find(player => player.id === me!.id);
    return (
      <div css={{ padding: 12, maxWidth: 1200, margin: '0 auto' }}>
        {endGameMessage ? (
          <EndGameMessage message={endGameMessage} />
        ) : (
          <>
            {playerRoleBannerUi}
            {meGamePlayer?.isDead && (
              <Alert
                type="warning"
                css={{ marginTop: 12 }}
                showIcon={false}
                message="You Dead"
              />
            )}
            <AwakeGame playerRole={playerRole} game={gameState} />
          </>
        )}
      </div>
    );
  }

  return null;
}

export default Game;
