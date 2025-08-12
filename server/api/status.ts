import type { TAllStatusData } from 'common/backend.types';
import type expressWs from 'express-ws';
import statusFetcher from 'server/services/status-fetcher';
import { prepareSocket } from 'server/services/websocket';

const handleStatusSocket: expressWs.WebsocketRequestHandler = async (websocket) => {
  prepareSocket(websocket);

  function unsubscribe() {
    statusFetcher.unsubscribe(send);
  }

  function send(data: TAllStatusData) {
    try {
      websocket.send(JSON.stringify(data));
    }
    catch (error) {
      console.error('Could not send a status update', error);
      unsubscribe();
      websocket.close();
    }
  }

  websocket.on('error', () => {
    unsubscribe();
    websocket.close();
  });

  websocket.on('close', () => {
    unsubscribe();
  });

  statusFetcher.subscribe(send);
};

export default handleStatusSocket;
