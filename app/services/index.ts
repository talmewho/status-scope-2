import apiPaths from 'common/api-paths';
import type { TAllStatusData } from 'common/backend.types';

type TNotifier = {
  close: () => void;
};

export function getStatusNotifications(notify: (data: TAllStatusData) => void): TNotifier {
  const socket = new WebSocket(apiPaths.status);

  socket.addEventListener('message', (event) => {
    notify(JSON.parse(event.data));
  });

  return {
    close() {
      socket.close();
    },
  };
}
