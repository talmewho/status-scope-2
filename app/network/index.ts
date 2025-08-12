import { SocketManager, type TSocketManagerOptions } from './socket';

export function connectSocket<T>(url: string, options: TSocketManagerOptions<T>): () => void {
  const socketManager = new SocketManager(url, options);
  return socketManager.close;
}
