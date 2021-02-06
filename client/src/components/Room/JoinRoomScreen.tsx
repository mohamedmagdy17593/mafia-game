/** @jsxImportSource @emotion/react */

import { Button, Card, Form, Input, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useRoom } from './Room';
import { socket } from 'utils/socket';

interface FormValue {
  name: string;
}

function JoinRoomScreen() {
  let { roomName, dispatch } = useRoom();
  let [loading, setLoading] = useState(true);
  let gameUserRef = useRef<any>();

  useEffect(() => {
    try {
      let gameUser = window.localStorage.getItem('game:user');
      let user = gameUser ? JSON.parse(gameUser) : null;
      if (user) {
        gameUserRef.current = user;
        socket.emit(
          'room:join',
          { roomName, token: user.token },
          (id: string | null, token: string) => {
            if (!id) {
              setLoading(false);
              return;
            }
            dispatch({ type: 'SET_ME_ID', id });
          },
        );
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, [dispatch, roomName]);

  function handleFinish(values: FormValue) {
    try {
      let { name } = values;
      let gameUser = window.localStorage.getItem('game:user');
      let user = gameUser ? JSON.parse(gameUser) : null;
      socket.emit(
        'room:join',
        { roomName, userName: name, token: user?.token },
        (id: string, token: string) => {
          dispatch({ type: 'SET_ME_ID', id });
          let gameUser = JSON.stringify({ token, name });
          window.localStorage.setItem('game:user', gameUser);
        },
      );
    } catch {}
  }

  if (loading) {
    return (
      <Spin>
        <div css={{ height: '100vh', width: '100%' }}></div>
      </Spin>
    );
  }

  return (
    <div
      css={{
        padding: 12,
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Card css={{ width: '100%', maxWidth: 300 }}>
        <Form
          initialValues={{ name: gameUserRef.current?.name }}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'You should have name to join' },
            ]}
          >
            <Input placeholder="Type your name"></Input>
          </Form.Item>
          <Button block type="primary" htmlType="submit">
            Join
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default JoinRoomScreen;
