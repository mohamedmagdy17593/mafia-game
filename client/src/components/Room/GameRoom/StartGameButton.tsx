/** @jsxImportSource @emotion/react */

import { Button, Tooltip } from 'antd';
import { useRoom } from '../Room';
import { socket } from 'utils/socket';

function StartGameButton() {
  let { me, state, roomName } = useRoom();
  let { players } = state.room!;

  function handleStartGame() {
    socket.emit('room:gameStart', { roomName });
  }

  if (me?.isAdmin) {
    let isStartDisabled = players.length < 4;

    return (
      <div css={{ textAlign: 'center', padding: 12 }}>
        {isStartDisabled ? (
          <Tooltip title="Players count is less than 4">
            <Button type="primary" disabled>
              Start game
            </Button>
          </Tooltip>
        ) : (
          <Button
            type="primary"
            disabled={isStartDisabled}
            onClick={handleStartGame}
          >
            Start game
          </Button>
        )}
      </div>
    );
  }

  return null;
}

export default StartGameButton;
