import apiPaths from 'common/api-paths';
import type { TAllStatusData } from 'common/backend.types';
import { connectSocket } from '../network';

function isValid(data: unknown): data is TAllStatusData {
  if (!data
    || typeof data !== 'object'
    || !Object.keys(data).length) {
    return false;
  }

  return true;
}

export const getStatusNotifications = (
  notify: (data: TAllStatusData) => void,
  notifyFailed?: () => void,
  dataTimeout?: number,
): () => void => {
  function fail() {
    closeSocket();
    notifyFailed?.();
  }

  function handleNotification(data: MessageEvent['data']) {
    let statusData: TAllStatusData | undefined;
    try {
      if (typeof data !== 'string') {
        throw new Error('Not a string');
      }

      statusData = JSON.parse(data);

      if (!isValid(statusData)) {
        throw new Error('Invalid data');
      }
    }
    catch (error) {
      console.error('Received an invalid message', { error, data, parsed: statusData });
      fail();
      return;
    }

    notify(statusData);
  }

  const options = {
    notify: handleNotification,
    notifyFailed: notifyFailed ?? fail,
    dataTimeout,
  };
  const closeSocket = connectSocket(apiPaths.status, options);

  return closeSocket;
};
