import type { TStatusData } from 'common/backend.types';
import styles from './Details.module.css';
import Tags from '../Tags';
import QuickStats from '../QuickStats';

type TDetails = {
  data: TStatusData;
};

function Details({
  data: {
    region,
    status,
    roles,
    results: {
      services,
      stats,
    },
    strict,
    server_issue: serverIssue,
    version,
  },
}: TDetails) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>
        {`${region} (running version ${version}) - `}
        {serverIssue ? <span className={styles.warning}>issues</span> : status}
        {strict && ' 🔑'}
      </h2>

      <Tags services={services} roles={roles} />

      <QuickStats stats={stats} />

      <div>
        Workers
        {' '}
        {stats.server.workers.map(([workerName, workerData]) => (
          <details key={workerName}>
            <summary>{workerName}</summary>
            {JSON.stringify(workerData, undefined, ' ')}
          </details>
        ))}
      </div>

      <div>
        {!serverIssue ? '✔ No server issues reported' : JSON.stringify(serverIssue)}
      </div>
    </section>
  );
}

export default Details;
