import { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import transformDate from '../utils/transformDate';
import isDummy from '../utils/isDummy';
import { handleError } from '../utils/errorsHandler';
import { useAPIDispatchContext } from '../api/contextAPI';

const BlocksStateContext = createContext([]);
BlocksStateContext.displayName = 'BlocksStateContext';

const BlocksDispatchContext = createContext([]);
BlocksDispatchContext.displayName = 'BlocksDispatchContext';

const transformBlocksData = (blocks) =>
  blocks.map((block) => {
    const {
      level,
      bakerName,
      priority,
      number_of_operations,
      volume,
      fees,
      endorsements,
    } = block;

    const MUTEZ = 1000000;
    const newDate = new Date(block.timestamp * 1000);
    const date = transformDate(newDate);

    return {
      level: isDummy(level),
      baker: isDummy(bakerName),
      timestamp: isDummy(date),
      priority: isDummy(priority),
      numOfOperations: isDummy(number_of_operations),
      volume: isDummy(volume / MUTEZ),
      fees: isDummy(fees / MUTEZ),
      endorsements: isDummy(endorsements),
    };
  });

const BlocksProvider = ({ children }) => {
  const [blocks, setBlocks] = useState([]);
  const [total, setTotal] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { getBlocks, getHead } = useAPIDispatchContext();

  const handleBlocks = async (offset, limit) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const response = await getBlocks(offset, limit);
      const transform = transformBlocksData(response.data);
      const head = await getHead();
      setTotal(head.data.level);
      setBlocks(transform);
    } catch (e) {
      handleError(e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const stateValue = useMemo(
    () => ({
      blocks,
      isLoading,
      isError,
      total,
    }),
    [blocks, isLoading, isError, total],
  );

  const dispatchValue = useMemo(
    () => ({
      handleBlocks,
    }),
    [handleBlocks],
  );

  return (
    <BlocksStateContext.Provider value={stateValue}>
      <BlocksDispatchContext.Provider value={dispatchValue}>
        {children}
      </BlocksDispatchContext.Provider>
    </BlocksStateContext.Provider>
  );
};

BlocksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useBlocksStateContext = () => {
  const context = useContext(BlocksStateContext);

  if (context.length === 0) {
    throw new Error(
      'useBlocksStateContext must be used within a BlocksProvider',
    );
  }

  return context;
};

const useBlocksDispatchContext = () => {
  const context = useContext(BlocksDispatchContext);

  if (context.length === 0) {
    throw new Error(
      'useBlocksDispatchContext must be used within a BlocksProvider',
    );
  }

  return context;
};

export { useBlocksStateContext, useBlocksDispatchContext, BlocksProvider };
