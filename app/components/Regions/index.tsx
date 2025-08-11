import type { ReactNode } from 'react';
import styles from './Regions.module.css';

function Regions({ children }: { children: ReactNode }) {
  return <div className={styles.container}>{children}</div>;
}

export default Regions;
