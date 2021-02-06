import { Server, Socket } from 'socket.io';
import server from './sever';
import connectionHandler from './sockets/connectionHandler';
import gameHandlers from './sockets/game';
import hackHandlers from './sockets/hack';
import roomHandlers from './sockets/room';

const io = new Server(server);

io.on('connection', (socket: Socket) => {
  connectionHandler(io, socket);

  roomHandlers(io, socket);
  gameHandlers(io, socket);
  hackHandlers(io, socket);
});

export default io;
