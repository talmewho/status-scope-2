import { useEffect, useState } from 'react';
import apiPaths from '../../common/api-paths';
import Details from '~/components/Details';
import Regions from '~/components/Regions';
import type { TStatusData } from 'common/backend.types';

export function meta() {
  return [
    { title: 'StatusScope' },
    { name: 'description', content: 'Scoping the status' },
  ];
}

export default function Home() {
  const [status, setStatus] = useState<TStatusData[]>([]);

  useEffect(() => {
    const socket = new WebSocket(apiPaths.status);

    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });

    socket.addEventListener('message', (event) => {
      console.log('Message from server:', JSON.parse(event.data));
      setStatus(Object.values(JSON.parse(event.data)));
    });

    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <Regions>
        {status.map(data => <Details data={data} />)}
      </Regions>
    </>
  );
}
