import type { TStatusData } from 'common/backend.types';
import styles from './Details.module.css';
import Tags from '../Tags';
import QuickStats from '../QuickStats';
import WorkerData from '../WorkerData';

type TDetails = {
  lastUpdated: number;
  data: TStatusData;
};

function Details({
  lastUpdated,
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
  const hasIssues = serverIssue ?? status !== 'ok';
  const hasIssuesClassName = hasIssues ? styles.hasIssues : '';
  const hasServerIssuesClassName = serverIssue ? styles.hasServerIssues : '';

  return (
    <section className={`${styles.wrapper} ${hasIssuesClassName}`}>
      <div className={styles.lastUpdated}>{`(Last updated - ${new Date(lastUpdated).toUTCString()})`}</div>

      <h2 className={styles.title}>
        {`${region} (running version ${version}) - `}
        <span className={hasIssues ? styles.warning : ''}>{status}</span>
        {strict && ' 🔑'}
      </h2>

      {hasIssues && (
        <div className={styles.issueNotification}>We seem to be experiencing some issues here.</div>
      )}

      <div className={styles.fullDetails}>
        <Tags services={services} roles={roles} />

        <QuickStats stats={stats} />

        <div className={styles.workers}>
          {stats.server.workers.map(([workerName, workerData]) => (
            <details className={styles.worker} key={workerName}>
              <summary>{`👷 ${workerName}`}</summary>
              <WorkerData worker={workerData} />
            </details>
          ))}
        </div>
      </div>

      <div className={`${styles.issues} ${hasServerIssuesClassName}`}>
        {!serverIssue ? '✔ No server issues reported' : `⚠️ ${JSON.stringify(serverIssue)}`}
      </div>
    </section>
  );
}

export default Details;
