import loader from './icons8-loader.svg';
import styles from './Loader.module.css';

function Loader() {
  return (
    <div className={styles.container}>
      <img src={loader} className={styles.loader} />
    </div>
  );
}

export default Loader;
