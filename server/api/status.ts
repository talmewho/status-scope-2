import type expressWs from 'express-ws';
import configuration from 'server/services/configuration';
import { StatusFetcher } from 'server/services/status-fetcher';
import { prepareSocket } from 'server/services/websocket';

const handleStatusSocket: expressWs.WebsocketRequestHandler = async (webSocket) => {
  const fetcher = new StatusFetcher(
    configuration.statusUrlTemplate,
    configuration.fetchInterval,
  );

  prepareSocket(webSocket);

  webSocket.on('close', () => {
    fetcher.terminate();
  });

  fetcher.on('data', (data) => {
    webSocket.send(JSON.stringify(data));
  });

  webSocket.send(JSON.stringify(await fetcher.fetchAllStatuses()));
};

export default handleStatusSocket;
