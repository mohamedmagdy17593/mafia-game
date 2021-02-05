/** @jsxImportSource @emotion/react */

import { Button } from 'antd';
import { useRoom } from 'components/Room.tsx/Room';

interface EndGameMessageProps {
  message: string;
}
function EndGameMessage({ message }: EndGameMessageProps) {
  let { me } = useRoom();

  return (
    <div>
      <div css={{ textAlign: 'center', padding: '56px 0' }}>
        <h1>{message}</h1>
      </div>
      {me?.isAdmin && (
        <div css={{ textAlign: 'center' }}>
          <Button type="primary">Go back to room start screen</Button>
        </div>
      )}
    </div>
  );
}

export default EndGameMessage;
