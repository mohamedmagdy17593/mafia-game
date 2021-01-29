import { Server, Socket } from 'socket.io';
import server from './sever';
import roomHandlers from './sockets/room';

const io = new Server(server);

io.on('connection', (socket: Socket) => {
  roomHandlers(io, socket);
});

export default io;
