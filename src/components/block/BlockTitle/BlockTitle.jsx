import { Link } from 'react-router-dom';
import Title from '../../shared/Title';
import styles from './BlockTitle.module.scss';
import { useBlockStateContext } from '../../../contexts/blockContext';
import useCurrentLocation from '../../../hooks/useCurrentLocation';

const BlockTitle = () => {
  const {
    block: { level },
    total,
  } = useBlockStateContext();

  const { title } = useCurrentLocation();

  return (
    <div className={`${styles['block-title']} wrapper__title`}>
      {total === level ? (
        <span
          className={`${styles['block-title__item']} ${styles['block-title__item--inactive']}`}
        >
          {'<'}
        </span>
      ) : (
        <Link
          className={styles['block-title__item']}
          aria-label="Next block id"
          to={`/blocks/${level + 1}`}
        >
          {'<'}
        </Link>
      )}
      <Title value={`Block: ${title}`} subtitle="Block information" centered />
      <Link
        className={styles['block-title__item']}
        aria-label="Previous block id"
        to={`/blocks/${level - 1}`}
      >
        {'>'}
      </Link>
    </div>
  );
};

export default BlockTitle;
