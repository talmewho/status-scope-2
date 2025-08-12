import { useEffect, useState } from 'react';
import Details from '~/components/Details';
import Regions from '~/components/Regions';
import type { TAllStatusData, TUpdatedStatusData } from 'common/backend.types';
import Loader from '~/components/Loader';
import { getStatusNotifications } from '~/services';

const dataTimeout = 1000 * 60 * 6;

export function meta() {
  return [
    { title: 'StatusScope' },
    { name: 'description', content: 'Scoping the status' },
  ];
}

export default function Home() {
  // Tristate -
  // undefined = loading
  // null = failed loading
  // TUpdatedStatusData[] = loaded and ready
  const [status, setStatus] = useState<TUpdatedStatusData[] | undefined | null>(undefined);

  const [attemptCount, setAttemptCount] = useState(0);

  function setErrorState() {
    setStatus(null);
  };

  function retry() {
    setAttemptCount(previousAttemptCount => previousAttemptCount + 1);
  }

  useEffect(() => {
    if (attemptCount > 3) {
      return;
    }

    function notify(data: TAllStatusData) {
      setAttemptCount(0);
      setStatus(Object.values(data));
    }

    const stopNotifications = getStatusNotifications(notify, setErrorState, dataTimeout);

    return stopNotifications;
  }, [attemptCount]);

  if (status === null) {
    return (
      <>
        Sorry, an error occurred while trying to load the status.
        {' '}
        {attemptCount < 2 && <button onClick={retry}>Retry</button>}
        <br />
        (Hopefully it is just a StatusScope problem and the actual application is fine!)
      </>
    );
  }

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
