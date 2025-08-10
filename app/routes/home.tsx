import { Welcome } from '../welcome/welcome';
import { useEffect, useState } from 'react';

export function meta() {
  return [
    { title: 'StatusScope' },
    { name: 'description', content: 'Scoping the status' },
  ];
}

export default function Home() {
  const [status, setStatus] = useState({});
  useEffect(() => {
    const socket = new WebSocket('/api/status');
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });
    socket.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
      setStatus(JSON.parse(event.data));
    });
    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });
    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    },
    );
    return () => {
      socket.close();
    };
  });

  return <Welcome message={JSON.stringify(status)} />;
}
