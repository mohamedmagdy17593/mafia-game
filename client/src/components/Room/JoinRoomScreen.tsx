/** @jsxImportSource @emotion/react */

import { Button, Card, Form, Input } from 'antd';
import { useRoom } from './Room';
import { socket } from 'utils/socket';

interface FormValue {
  name: string;
}

function JoinRoomScreen() {
  let { roomName, dispatch } = useRoom();

  function handleFinish(values: FormValue) {
    let { name } = values;
    socket.emit('room:join', { roomName, userName: name }, (id: string) => {
      dispatch({ type: 'SET_ME_ID', id });
    });
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
        <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
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
