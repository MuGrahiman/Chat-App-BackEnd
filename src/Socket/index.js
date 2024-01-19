import { Server } from 'socket.io';

const io = new Server();

io.on('connection', (socket) =>
	console.log(`socket server connected successfully :${socket.id}`)
);
export default io;
