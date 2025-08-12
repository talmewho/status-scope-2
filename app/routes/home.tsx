import { useEffect, useState } from 'react';
import Details from '~/components/Details';
import Regions from '~/components/Regions';
import type { TUpdatedStatusData } from 'common/backend.types';
import Loader from '~/components/Loader';
import { getStatusNotifications } from '~/services';

export function meta() {
  return [
    { title: 'StatusScope' },
    { name: 'description', content: 'Scoping the status' },
  ];
}

export default function Home() {
  const [status, setStatus] = useState<TUpdatedStatusData[] | undefined>(undefined);

  useEffect(() => {
    const close = getStatusNotifications(data => setStatus(Object.values(data)));

    return close;
  }, []);

  if (status === undefined) {
    return <Loader />;
  }

  return (
    <>
      <Regions>
        {status.map(({ data, lastUpdated }) => (
          <Details data={data} lastUpdated={lastUpdated} key={data.region} />
        ))}
      </Regions>
    </>
  );
}
