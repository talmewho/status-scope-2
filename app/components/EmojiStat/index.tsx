import type { ReactNode } from 'react';
import styles from './EmojiStat.module.css';

type TEmojiStat = {
  title: string;
  children: ReactNode;
  isOverloaded?: boolean;
};

function EmojiStat({ title, children, isOverloaded }: TEmojiStat) {
  return (
    <span className={styles.wrapper} title={title}>
      {children}
      {' '}
      {isOverloaded && '⚠️'}
    </span>
  );
}

export default EmojiStat;
