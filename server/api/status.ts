import type expressWs from 'express-ws';

const handleStatusSocket: expressWs.WebsocketRequestHandler = async (webSocket, request) => {
  console.log('WebSocket connection established:', request.url);
  webSocket.on('message', (data) => {
    console.log(data);
  });
  webSocket.send('"Hello"');
};

export default handleStatusSocket;
