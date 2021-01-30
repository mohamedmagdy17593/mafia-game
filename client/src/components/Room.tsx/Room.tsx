/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect, useMemo, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import JoinRoomScreen from './JoinRoomScreen';
import GameRoomScreen from './GameRoom/GameRoomScreen';
import { socket } from 'utils/socket';
import { Player, Room } from 'types/room';

/**
 * room context
 */
interface RoomContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
  roomName: string;
  me?: Player;
}

const RoomContext = React.createContext({} as RoomContextProps);

export function useRoom() {
  return useContext(RoomContext);
}

/**
 * state and reducer
 */
interface State {
  meId: string | undefined;
  room?: Room;
}

type Action =
  | { type: 'SET_ME_ID'; id: string }
  | { type: 'SET_ROOM'; room: Room };

function roomReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_ME_ID': {
      let { id } = action;
      return { ...state, meId: id };
    }
    case 'SET_ROOM': {
      let { room } = action;
      return { ...state, room };
    }
    default: {
      return state;
    }
  }
}

/**
 * component
 */
function RoomComponent() {
  let [state, dispatch] = useReducer(roomReducer, { meId: undefined });
  let { roomName } = useParams<{ roomName: string }>();

  useEffect(() => {
    let handler = (room: Room) => {
      if (room.roomName === roomName) {
        console.log('room', room);
        dispatch({ type: 'SET_ROOM', room });
      }
    };
    socket.on('room:state', handler);
    return () => {
      socket.off('room:state', handler);
    };
  }, [roomName]);

  let me = useMemo(
    () => state.room?.players.find(player => player.id === state.meId),
    [state.meId, state.room?.players],
  );

  let value = useMemo(
    () => ({
      state,
      dispatch,
      roomName,
      me,
    }),
    [me, roomName, state],
  );

  return (
    <RoomContext.Provider value={value}>
      {state.meId && state.room ? <GameRoomScreen /> : <JoinRoomScreen />}
    </RoomContext.Provider>
  );
}

export default RoomComponent;
