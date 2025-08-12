import EventEmitter from 'events';
import { WebSocket } from 'ws';
import { prepareSocket } from './websocket';

class SocketMock extends EventEmitter {
  send = jest.fn();
}

describe('websocket service', () => {
  it('prepareSocket detects pings and sends pongs', () => {
    const socketMock = new SocketMock() as unknown as WebSocket;
    prepareSocket(socketMock);

    socketMock.emit('message', 'ping');

    expect(socketMock.send).toHaveBeenCalledWith('pong');
  });
});
