/** @jsxImportSource @emotion/react */

import { Alert, Button, Col, Avatar, Row, Tooltip } from 'antd';
import avatars from 'components/Avatars/Avatars';
import { useRoom } from 'components/Room.tsx/Room';
import { GamePlayersRoles } from 'types/game';
import { AWAKERoom } from 'types/room';
import { socket } from 'utils/socket';

interface AwakeGameProps {
  game: AWAKERoom;
  playerRole: GamePlayersRoles | null;
}
function AwakeGame({ game, playerRole }: AwakeGameProps) {
  let { me, roomName } = useRoom();
  let { players } = game;
  let meGamePlayer = game.players.find(player => player.id === me!.id);

  let canSelect = meGamePlayer && !meGamePlayer.isDead;

  return (
    <div>
      <Alert css={{ marginTop: 12 }} type="info" message={game.message} />

      <h2 css={{ textAlign: 'center', margin: '12px 0' }}>
        Who are you think is the Mafia 🦹‍♂️
      </h2>

      <Row gutter={[12, 12]}>
        {players.map(player => {
          let votedPlayers = players.filter(
            p => !p.isDead && p.select === player.id,
          );
          let hasActionButton =
            canSelect && !player.isDead && player.id !== me?.id;
          let votedByYou = votedPlayers.some(p => p.id === meGamePlayer?.id);

          function handelVote() {
            socket.emit('game:player:select', {
              roomName,
              playerId: me!.id,
              selectedId: votedByYou ? undefined : player.id,
            });
          }

          return (
            <Col span={24} md={12} key={player.id}>
              <div
                css={{
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...(player.isDead && {
                    opacity: 0.5,
                    ':hover': {
                      cursor: 'not-allowed',
                    },
                  }),
                }}
              >
                <div
                  css={{
                    width: 80,
                    textAlign: 'center',
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div css={{ width: 64, height: 64 }}>
                    {avatars[player.avatarIndex]}
                  </div>
                  <small
                    className="truncate"
                    css={{ display: 'inline-block', width: '100%' }}
                  >
                    {player.name}
                  </small>
                </div>

                <div css={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar.Group size="small" css={{ marginRight: 12 }}>
                    {votedPlayers.map(player => (
                      <Tooltip title={player.name}>
                        <Avatar icon={avatars[player.avatarIndex]} />
                      </Tooltip>
                    ))}
                  </Avatar.Group>

                  {hasActionButton ? (
                    <Button type="primary" onClick={handelVote}>
                      {votedByYou ? 'UnVote' : 'Vote'}
                    </Button>
                  ) : null}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default AwakeGame;
