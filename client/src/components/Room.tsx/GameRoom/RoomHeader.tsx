/** @jsxImportSource @emotion/react */

import { Divider, Space, Typography } from 'antd';
import { useRoom } from '../Room';
import { mq } from 'utils/styles';

const { Title, Paragraph, Text } = Typography;

function RoomHeader() {
  let { state } = useRoom();
  let meId = state.meId;
  let { players } = state.room!;

  let roomUrl = window.location.href;

  return (
    <div
      css={{
        textAlign: 'center',
        padding: `24px 12px`,
        background: 'var(--primary-color)',
      }}
    >
      <div>
        <Space
          split={
            <Divider css={{ [mq[1]]: { display: 'none' } }} type="vertical" />
          }
          align="baseline"
        >
          <Title level={3}>Players({players.length})</Title>
          <Paragraph
            css={{
              marginBottom: 0,
              '.ant-typography-copy': { color: `var(--white)` },
              [mq[1]]: { display: 'none' },
            }}
            copyable
          >
            {roomUrl}
          </Paragraph>
        </Space>
      </div>
      {players.map(player => {
        let tagsText = [player.isAdmin && 'admin', player.id === meId && 'me']
          .filter(Boolean)
          .join(', ');
        let tags = tagsText && `(${tagsText})`;
        return (
          <span
            key={player.id}
            css={{
              display: 'inline-block',
              margin: 4,
              padding: 4,
              border: `1px solid var(--white)`,
              borderRadius: 2,
              '.ant-tag:last-child': {
                marginRight: 0,
              },
            }}
          >
            {player.name} {tags && <Text type="secondary">{tags}</Text>}
          </span>
        );
      })}
    </div>
  );
}

export default RoomHeader;
