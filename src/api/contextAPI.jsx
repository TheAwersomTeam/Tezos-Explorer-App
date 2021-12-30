import PropTypes from 'prop-types';
import axios from 'axios';

import { createContext, useContext, useMemo } from 'react';
import { useNetworkStateContext } from '../contexts/networkContext';

const APIDispatchContext = createContext('');
APIDispatchContext.displayName = 'APIDispatchContext';

const APIProvider = ({ children }) => {
  const tezTrackerAPI = axios.create({});
  const { network } = useNetworkStateContext();

  tezTrackerAPI.interceptors.request.use((req) => {
    req.baseURL = `https://api.teztracker.com/v2/data/tezos/${network}`;
    return req;
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
    throw new Error('useAPIState must be used within a APIProvider');
  }

  return context;
};

export { useAPIDispatchContext, APIProvider };
