import { SocketManager, type TSocketManagerOptions } from './SocketManager';

export function connectSocket<T>(url: string, options: TSocketManagerOptions<T>): () => void {
  const socketManager = new SocketManager(url, options);
  return socketManager.close;
}
