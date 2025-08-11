import type expressWs from 'express-ws';
import { StatusFetcher } from 'server/services/status-fetcher';

const handleStatusSocket: expressWs.WebsocketRequestHandler = async (webSocket, request) => {
  const fetcher = new StatusFetcher(process.env.STATUS_URL_TEMPLATE!);
  console.log('WebSocket connection established:', request.url);

  webSocket.on('message', (data) => {
    console.log(data);
  });

  webSocket.on('close', () => {
    fetcher.terminate();
  });

  fetcher.on('data', (data) => {
    webSocket.send(JSON.stringify(data));
  });

  webSocket.send(JSON.stringify(await fetcher.fetchAllStatuses()));
};

export default handleStatusSocket;
