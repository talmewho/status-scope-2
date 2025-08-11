import type expressWs from 'express-ws';
import configuration from 'server/services/configuration';
import { StatusFetcher } from 'server/services/status-fetcher';

const handleStatusSocket: expressWs.WebsocketRequestHandler = async (webSocket) => {
  const fetcher = new StatusFetcher(
    configuration.statusUrlTemplate,
    configuration.fetchInterval,
  );

  webSocket.on('message', (data) => {
    if (data.toString('utf-8') === 'ping') {
      webSocket.send('pong');
    }
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
