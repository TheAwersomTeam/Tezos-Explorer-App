import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import transformDate from '../utils/transformDate';
import isDummy from '../utils/isDummy';
import { handleError } from '../utils/errorsHandler';
import { useAPIDispatchContext } from '../api/contextAPI';

const BlockStateContext = createContext('');
BlockStateContext.displayName = 'BlockStateContext';

const BlockDispatchContext = createContext('');
BlockDispatchContext.displayName = 'BlockDispatchContext';

const transformBlockData = (block) => {
  const {
    block: {
      level,
      hash,
      timestamp,
      bakerName,
      fees,
      priority,
      volume,
      blockTime,
      fitness,
      consumedGas,
      protocol,
      metaCycle,
      metaCyclePosition,
    },
  } = block;

  const MUTEZ = 1000000;
  const newDate = new Date(timestamp * 1000);
  const date = transformDate(newDate);

  return {
    level: isDummy(level),
    hash: isDummy(hash),
    timestamp: isDummy(date),
    baker: isDummy(bakerName),
    fees: isDummy(fees / MUTEZ),
    priority: isDummy(priority),
    volume: isDummy(volume / MUTEZ),
    blockTime: isDummy(blockTime),
    fitness: isDummy(fitness),
    gas: isDummy(consumedGas / MUTEZ),
    protocol: isDummy(protocol),
    cycle: isDummy(metaCycle),
    cyclePosition: isDummy(metaCyclePosition),
  };
};

const BlockProvider = ({ children }) => {
  const [block, setBlock] = useState({});
  const [total, setTotal] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { getBlock, getHead } = useAPIDispatchContext();

  const handleBlock = async (id) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const response = await getBlock(id);
      const transform = transformBlockData(response.data);
      const head = await getHead();
      setTotal(head.data.level);
      setBlock(transform);
    } catch (e) {
      handleError(e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const stateValue = useMemo(
    () => ({
      block,
      total,

      isLoading,
      isError,
    }),
    [block, isLoading, isError],
  );

  const dispatchValue = useMemo(
    () => ({
      handleBlock,
    }),
    [handleBlock],
  );

  return (
    <BlockStateContext.Provider value={stateValue}>
      <BlockDispatchContext.Provider value={dispatchValue}>
        {children}
      </BlockDispatchContext.Provider>
    </BlockStateContext.Provider>
  );
};

BlockProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useBlockStateContext = () => {
  const context = useContext(BlockStateContext);

  if (!context) {
    throw new Error(
      'useBlockDispatchContext must be used within a BlockProvider',
    );
  }

  return context;
};

const useBlockDispatchContext = () => {
  const context = useContext(BlockDispatchContext);

  if (!context) {
    throw new Error(
      'useBlockDispatchContext must be used within a BlockProvider',
    );
  }

  return context;
};

export { useBlockStateContext, useBlockDispatchContext, BlockProvider };
