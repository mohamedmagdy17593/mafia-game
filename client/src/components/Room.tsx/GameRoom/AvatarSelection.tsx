/** @jsxImportSource @emotion/react */

import { Typography } from 'antd';
import { useRoom } from '../Room';

import avatars from 'components/Avatars/Avatars';
import { PureButton } from 'components/common/Button';
import { socket } from 'utils/socket';

const { Title, Text } = Typography;

function AvatarSelection() {
  let { me, state, roomName } = useRoom();
  let { room } = state;
  let { players } = room!;
  let { avatarIndex, name, id: meId } = me!;

  function handleSelectAvatar(avatarIndex: number) {
    socket.emit('room:selectAvatar', {
      playerId: me?.id!,
      roomName,
      avatarIndex,
    });
  }

  return (
    <div
      css={{
        textAlign: 'center',
        padding: 12,
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <Title level={2}>Select your avatar</Title>
      <div
        css={{
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          flexFlow: 'column',
        }}
      >
        <span css={{ width: 200, height: 200, display: 'inline-block' }}>
          {avatars[avatarIndex]}
        </span>
        <Text>{name}</Text>
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, 100px)',
          justifyContent: 'center',
          gridGap: 12,
        }}
      >
        {avatars.map((avatar, i) => {
          let selectedPlayer = players.find(player => player.avatarIndex === i);
          let isSelectedByMe = selectedPlayer?.id === meId;
          return (
            <PureButton
              key={i}
              disabled={!!selectedPlayer}
              onClick={() => handleSelectAvatar(i)}
            >
              <span
                css={{
                  position: 'relative',
                  display: 'block',
                  borderRadius: 4,
                  ...(isSelectedByMe && {
                    background: `var(--primary-color-faded)`,
                  }),
                  ...(selectedPlayer && {
                    '&:after': {
                      content: '"Selected"',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      fontSize: 18,
                      textTransform: 'uppercase',
                      transform: 'rotate(-45deg)',
                      fontFamily: "'Architects Daughter', cursive",
                      fontStyle: 'italic',
                      textShadow: `
                  -1px -1px 0 var(--component-background),
                   1px -1px 0 var(--component-background),
                   -1px 1px 0 var(--component-background),
                    1px 1px 0 var(--component-background)
                  `,
                      color: 'var(--white)',
                      display: 'grid',
                      placeItems: 'center',
                    },
                  }),
                }}
              >
                {avatar}
              </span>
              <Text css={{ height: 17, display: 'inline-block' }}>
                {selectedPlayer?.name}
              </Text>
            </PureButton>
          );
        })}
      </div>
    </div>
  );
}

export default AvatarSelection;
