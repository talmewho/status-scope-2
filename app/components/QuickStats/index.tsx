import type { TStats } from 'common/backend.types';
import EmojiStat from '../EmojiStat';
import styles from './QuickStats.module.css';

type TQuickStats = {
  stats: TStats;
};
function QuickStats({
  stats: {
    server: {
      cpus,
      cpu_load: cpuLoad,
      active_connections: activeConnections,
      timers,
      wait_time: waitTime,
    },
    servers_count: serverCount,
    online,
    session,
  },
}: TQuickStats) {
  return (
    <div className={styles.container}>
      <EmojiStat title="Server count">
        🖥
        {' '}
        {serverCount}
      </EmojiStat>
      <EmojiStat title="CPUs" isOverloaded={cpuLoad > 0.7}>
        ⚡
        {' '}
        {cpus}
        {' '}
        (
        {Math.ceil(cpuLoad * 100)}
        % load)
      </EmojiStat>
      <EmojiStat title="Active connections">
        🔗
        {' '}
        {activeConnections}
      </EmojiStat>
      <EmojiStat title="Timers">
        ⏲️
        {' '}
        {timers}
      </EmojiStat>
      <EmojiStat title="Wait time" isOverloaded={waitTime > 3000}>
        ⏳
        {' '}
        {waitTime}
        {' '}
        ms
      </EmojiStat>

      <EmojiStat title="Online">
        🌐
        {' '}
        {online}
        {' '}
      </EmojiStat>

      <EmojiStat title="Sessions">
        👨🏻‍💻
        {' '}
        {session}
      </EmojiStat>
    </div>
  );
}

export default QuickStats;
