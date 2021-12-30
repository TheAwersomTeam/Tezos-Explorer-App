import PropTypes from 'prop-types';
import styles from './BlockInfo.module.scss';
import { useBlockStateContext } from '../../../contexts/blockContext';
import Loader from '../../shared/Loader';

const BlockInfo = ({ headers, block }) => {
  const { isLoading } = useBlockStateContext();

  return (
    <div className={styles['block-info']}>
      {isLoading && <Loader />}
      {headers.map((header) => (
        <div className={styles['block-info__item']} key={header.key}>
          <p className={styles['block-info__header']}>{header.name}:</p>
          <div className={styles['block-info__value']}>
            {header.render ? header.render(block) : block[header.key]}
          </div>
        </div>
      ))}
    </div>
  );
};

BlockInfo.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  block: PropTypes.shape().isRequired,
};

export default BlockInfo;
