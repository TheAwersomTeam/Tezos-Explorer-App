import PropTypes from 'prop-types';
import axios from 'axios';

import { createContext, useContext, useMemo } from 'react';
import { useNetworkStateContext } from '../contexts/networkContext';

const APIDispatchContext = createContext('');
APIDispatchContext.displayName = 'APIDispatchContext';

const APIProvider = ({ children }) => {
  const { network } = useNetworkStateContext();

  const tezTrackerAPI = axios.create({
    baseURL: `https://api.teztracker.com/v2/data/tezos/${network}`,
  });

  const getBlocks = (offset = 0, limit = 15) =>
    tezTrackerAPI.get(`/blocks?limit=${limit}&offset=${offset}`);

  const getBlock = (id) => tezTrackerAPI.get(`/blocks/${id}`);

  const getHead = () => tezTrackerAPI.get(`/blocks/head`);

  const dispatchValue = useMemo(
    () => ({
      getBlocks,
      getBlock,
      getHead,
    }),
    [getBlocks, getBlock, getHead],
  );

  return (
    <APIDispatchContext.Provider value={dispatchValue}>
      {children}
    </APIDispatchContext.Provider>
  );
};

APIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAPIDispatchContext = () => {
  const context = useContext(APIDispatchContext);

  if (!context) {
    throw new Error('useAPIDispatchContext must be used within a APIProvider');
  }

  return context;
};

export { useAPIDispatchContext, APIProvider };
