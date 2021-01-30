/** @jsxImportSource @emotion/react */

import Game from '../Game/Game';
import { useRoom } from '../Room';
import AvatarSelection from './AvatarSelection';
import RoomHeader from './RoomHeader';
import StartGameButton from './StartGameButton';

function GameRoomScreen() {
  let { state } = useRoom();
  let { room } = state;
  let { state: roomState } = room!;

  if (roomState === 'IDEL') {
    return (
      <div>
        <RoomHeader />
        <AvatarSelection />
        <StartGameButton />
      </div>
    );
  } else if (roomState === 'RUNNING') {
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
