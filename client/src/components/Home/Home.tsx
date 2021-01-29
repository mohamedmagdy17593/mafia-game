/** @jsxImportSource @emotion/react */

import { Button, Typography } from 'antd';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import mafiaBg from 'images/mafia-bg.jpeg';
import { socket } from 'utils/socket';

const { Title } = Typography;

function Home() {
  let [loading, setLoading] = useState(false);
  let history = useHistory();

  function handleCreate() {
    setLoading(true);
    socket.emit('room:create', (roomName: string) => {
      setLoading(false);
      history.push(`/room/${roomName}`);
    });
  }

  return (
    <div
      css={{
        height: '100vh',
        background: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${mafiaBg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        padding: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexFlow: 'column',
      }}
    >
      <Title
        css={{ fontFamily: "'Lobster', cursive", fontSize: '56px !important' }}
      >
        Mafia
      </Title>
      <Button
        loading={loading}
        type="primary"
        size="large"
        onClick={handleCreate}
      >
        Create Room
      </Button>
    </div>
  );
}

export default Home;
