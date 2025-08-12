export function connectSocket<T>(url: string, notify: (data: T) => void) {
  const socket = new WebSocket(url);

  socket.addEventListener('message', (event) => {
    notify(JSON.parse(event.data));
  });

  return {
    close() {
      socket.close();
    },
  };
}
