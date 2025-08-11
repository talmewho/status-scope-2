import styles from './Tag.module.css';

export enum ETagType {
  Service = 'service',
  Role = 'role',
}

const typeToClassNameMap: Record<ETagType, string> = {
  [ETagType.Service]: styles.serviceTag,
  [ETagType.Role]: styles.roleTag,
};

type TTag = {
  type: ETagType;
  value: string;
};

function Tag({ type, value }: TTag) {
  return (
    <span className={`${styles.tag} ${typeToClassNameMap[type]}`} key={value}>{value}</span>
  );
}

export default Tag;
