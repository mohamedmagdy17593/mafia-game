import { Socket } from 'dgram';
import { Server } from 'socket.io';
import server from './sever';

const io = new Server(server);

io.on('connection', (socket: Socket) => {
  socket.emit('welcome', 'Welcome back');

  socket.on('message', (msg: string) => {
    console.log(msg);
  });
});

export default io;
