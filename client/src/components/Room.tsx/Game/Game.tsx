import { useEffect } from 'react';
import { useRoom } from '../Room';
import { socket } from 'utils/socket';

function Game() {
  let { me, roomName } = useRoom();

  useEffect(() => {
    console.log('emit game:myRole');
    socket.emit('game:myRole', { roomName, id: me?.id }, (role: string) => {
      console.log({ role });
    });
  }, [me?.id, roomName]);

  return <div>{/* <pre>{JSON.stringify(room, null, 2)}</pre> */}</div>;
}

export default Game;
