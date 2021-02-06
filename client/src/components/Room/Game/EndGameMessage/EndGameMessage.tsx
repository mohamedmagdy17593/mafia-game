/** @jsxImportSource @emotion/react */

import { Button } from 'antd';
import { useRoom } from 'components/Room/Room';
import { socket } from 'utils/socket';

interface EndGameMessageProps {
  message: string;
}
function EndGameMessage({ message }: EndGameMessageProps) {
  let { me, roomName } = useRoom();

  return (
    <div>
      <div css={{ textAlign: 'center', padding: '56px 0' }}>
        <h1>{message}</h1>
      </div>
      {me?.isAdmin && (
        <div css={{ textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={() => {
              socket.emit('game:restart', { roomName });
            }}
          >
            Go back to room start screen
          </Button>
        </div>
      )}
    </div>
  );
}

export default EndGameMessage;
