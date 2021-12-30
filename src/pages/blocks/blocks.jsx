import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useBlocksStateContext,
  useBlocksDispatchContext,
} from '../../contexts/blocksContext';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import addUnit from '../../utils/addUnit';

import Breadcrumbs from '../../components/shared/Breadcrumbs';
import Title from '../../components/shared/Title';
import Pagination from '../../components/table/Pagination';
import Table from '../../components/table/Table';
import PerPage from '../../components/table/PerPage';
import Baker from '../../components/shared/Baker';
import ErrorMessage from '../../components/shared/ErrorMessage';

import styles from './blocks.module.scss';
import Loader from '../../components/shared/Loader';

const HEADERS = [
  {
    name: 'Block ID',
    key: 'level',
    render: (row) => <Link to={`/blocks/${row.level}`}>{row.level} </Link>,
  },
  {
    name: 'Created',
    key: 'timestamp',
  },
  {
    name: 'Baker',
    key: 'baker',
    render: (row) => <Baker value={row.baker} />,
  },
  {
    name: 'Priority',
    key: 'priority',
  },
  {
    name: '# of operations',
    key: 'numOfOperations',
  },
  {
    name: 'Volume',
    key: 'volume',
    render: (row) => addUnit(row.volume, 'ꜩ'),
  },
  {
    name: 'Fees',
    key: 'fees',
    render: (row) => addUnit(row.fees, 'ꜩ'),
  },
  {
    name: '# of endorsements',
    key: 'endorsements',
  },
];

const byField = (field) => (a, b) => {
  if (Number(a[field])) {
    return a[field] - b[field];
  }
  return a[field].localeCompare(b[field]);
};

const Blocks = () => {
  const { blocks, total, isError, isLoading } = useBlocksStateContext();
  const { handleBlocks } = useBlocksDispatchContext();
  const [limit, setLimit] = useState('15');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState({
    key: 'level',
    direction: false,
  });

  const totalPages = Math.ceil(total / limit);

  const onPageChanged = (page) => {
    setCurrentPage(page);
    setSort({
      key: 'level',
      direction: false,
    });
    window.scrollTo(0, 0);
  };

  const onLimitChanged = (e) => {
    setLimit(e.target.value);
    onPageChanged(1);
  };

  const onSortBy = (e) => {
    const { value } = e.target;

    if (sort.key === value) {
      if (sort.direction) {
        blocks.reverse(byField(value));
      } else {
        blocks.sort(byField(value));
      }
      setSort({
        key: value,
        direction: !sort.direction,
      });
    } else {
      setSort({
        key: value,
        direction: true,
      });
      blocks.sort(byField(value));
    }
  };

  useEffect(() => {
    const offset = (currentPage - 1) * limit;
    handleBlocks(offset, limit);
  }, [currentPage, limit]);

  const { title } = useCurrentLocation();

  return (
    <>
      <Breadcrumbs />
      <Title value={title} wrapped />
      {isError ? (
        <ErrorMessage retry={() => handleBlocks(0, 15)} />
      ) : (
        <div className={styles.blocks}>
          {isLoading && <Loader />}
          <Table
            cols={HEADERS}
            rows={blocks}
            currentSort={sort}
            sortFunction={onSortBy}
          />
          <nav className={styles.blocks__navigation}>
            <PerPage limit={limit} handleChangeLimit={onLimitChanged} />
            <Pagination
              onPageChanged={onPageChanged}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </nav>
        </div>
      )}
    </>
  );
};

export default Blocks;
