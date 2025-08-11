import type { ReactNode } from 'react';
import styles from './EmojiStat.module.css';

type TEmojiStat = {
  title: string;
  children: ReactNode;
  isOverloaded?: boolean;
};

function EmojiStat({ title, children, isOverloaded }: TEmojiStat) {
  const isOverloadedClassName = isOverloaded ? styles.isOverloaded : '';

  return (
    <span className={`${styles.wrapper} ${isOverloadedClassName}`} title={title}>
      {children}
      {' '}
      {isOverloaded && '⚠️'}
    </span>
  );
}

export default EmojiStat;
