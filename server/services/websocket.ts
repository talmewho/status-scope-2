import { type WebSocket } from 'ws';

export function prepareSocket(webSocket: WebSocket, handleMessage?: (data: string) => void) {
  webSocket.on('message', (data) => {
    const dataAsString = data.toString('utf-8');

    if (dataAsString === 'ping') {
      webSocket.send('pong');
    }

    handleMessage?.(dataAsString);
  });
}
