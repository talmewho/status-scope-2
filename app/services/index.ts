import apiPaths from 'common/api-paths';
import type { TAllStatusData } from 'common/backend.types';
import { connectSocket } from '../network';

export const getStatusNotifications = (notify: (data: TAllStatusData) => void) => {
  return connectSocket(apiPaths.status, notify);
};
