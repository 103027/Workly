// pages/api/socket.js
import { Server } from 'socket.io';

export default function handler(req, res) {
    if (res.socket.server.io) {
        console.log('Socket is already running');
    } else {
        console.log('Socket is initializing');
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', socket => {
            console.log('A user connected');

            socket.on('updateData', () => {
                socket.broadcast.emit('refreshData');
            });
        });
    }
    res.end();
}
