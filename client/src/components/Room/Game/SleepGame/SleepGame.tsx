/** @jsxImportSource @emotion/react */

import { Button, Col, Row } from 'antd';
import { useState } from 'react';
import avatars from 'components/Avatars/Avatars';
import { useRoom } from 'components/Room/Room';
import { GamePlayersRoles } from 'types/game';
import { SLEEPRoom } from 'types/room';
import { socket } from 'utils/socket';

interface SleepGameProps {
  game: SLEEPRoom;
  playerRole: GamePlayersRoles | null;
}
function SleepGame({ game, playerRole }: SleepGameProps) {
  let { me, roomName } = useRoom();
  let { players } = game;
  let [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  let meGamePlayer = game.players.find(player => player.id === me!.id);

  let canSelect = meGamePlayer && !meGamePlayer.isDead;
  let canSelectHimSelf = playerRole === 'DOCTOR';

  function handleSelectPlayer(selectedId: string | undefined) {
    socket.emit(
      'game:player:select',
      {
        roomName,
        playerId: me!.id,
        selectedId,
      },
      (selectedId: string | undefined) => {
        setSelectedId(selectedId);
      },
    );
  }

  return (
    <div>
      <Row gutter={[12, 12]}>
        {players.map(player => {
          let isSelected = player.id === selectedId;

          let actionButton =
            playerRole === 'MAFIA' ? (
              <Button
                type="primary"
                size="small"
                danger
                onClick={() => {
                  handleSelectPlayer(isSelected ? undefined : player.id);
                }}
              >
                {isSelected ? 'UnKill' : 'Kill'}
              </Button>
            ) : playerRole === 'DOCTOR' ? (
              <Button
                type="default"
                size="small"
                onClick={() => {
                  handleSelectPlayer(isSelected ? undefined : player.id);
                }}
              >
                {isSelected ? 'UnTreat' : 'Treat'}
              </Button>
            ) : playerRole === 'OFFICER' ? (
              <Button
                type="default"
                size="small"
                onClick={() => {
                  handleSelectPlayer(isSelected ? undefined : player.id);
                }}
              >
                {isSelected ? 'Is not the mafia?' : 'Is he the mafia?'}
              </Button>
            ) : null;

          let hasActionButton =
            canSelect &&
            !player.isDead &&
            (player.id !== me?.id || canSelectHimSelf);

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

                {hasActionButton ? actionButton : null}
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default SleepGame;
