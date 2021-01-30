/** @jsxImportSource @emotion/react */

import Game from '../Game/Game';
import { useRoom } from '../Room';
import AvatarSelection from './AvatarSelection';
import RoomHeader from './RoomHeader';
import StartGameButton from './StartGameButton';

function GameRoomScreen() {
  let { state } = useRoom();
  let { room } = state;
  let { gameState } = room!;

  if (gameState.state === 'IDLE') {
    return (
      <div>
        <RoomHeader />
        <AvatarSelection />
        <StartGameButton />
      </div>
    );
  } else if (gameState.state === 'SLEEP') {
    return (
      <div>
        <RoomHeader />
        <Game />
      </div>
    );
  }

  return null;
}

export default GameRoomScreen;
