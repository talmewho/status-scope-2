import type { TWorkerDetails } from 'common/backend.types';
import EmojiStat from '../EmojiStat';
import styles from './WorkerData.module.css';

type TWorkerData = {
  worker: TWorkerDetails;
};

function WorkerData({ worker: {
  idle,
  workers,
  wait_time: waitTime,
  waiting,
  time_to_return: timeToReturn,
  recently_blocked_keys: recentlyBlockedKeys,
  top_keys: topKeys,
} }: TWorkerData) {
  return (
    <>
      <EmojiStat title="Idle">
        {`😶 ${idle}`}
      </EmojiStat>
      <EmojiStat title="Workers">
        {`👨‍🏭 ${workers}`}
      </EmojiStat>
      <EmojiStat title="Wait time" isOverloaded={waitTime > 3000}>
        {`⏳ ${waitTime} ms`}
      </EmojiStat>
      <EmojiStat title="Waiting">
        {`🔜 ${waiting}`}
      </EmojiStat>
      <EmojiStat title="Time to return">
        {`↩️ ${timeToReturn} ms`}
      </EmojiStat>
      {(!!recentlyBlockedKeys.length || !!topKeys.length) && (
        <details className={styles.rawKeyDetails}>
          <summary>Raw key details</summary>
          <br />
          {recentlyBlockedKeys.length && <strong>Recently blocked keys</strong>}
          {recentlyBlockedKeys.map(data => <div key={data[0]}>{data.join(', ')}</div>)}
          <br />
          {topKeys.length && <strong>Top keys</strong>}
          {topKeys.map(data => <div key={data[0]}>{`${data[0]} (${data[1]} ms)`}</div>)}
        </details>
      )}
    </>
  );
}

export default WorkerData;
