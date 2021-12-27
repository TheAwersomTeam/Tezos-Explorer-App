import PropTypes from 'prop-types';
import axios from 'axios';

import { createContext, useContext, useMemo } from 'react';
import { useNetworkState } from '../contexts/networkContext';

const APIStateContext = createContext('');
APIStateContext.displayName = 'API Context';

const useAPIState = () => {
  const context = useContext(APIStateContext);

  if (!context) {
    throw new Error('useAPIState must be used within a APIProvider');
  }

  return context;
};

const APIProvider = ({ children }) => {
  const tezTrackerAPI = axios.create({});
  const { network } = useNetworkState();

  tezTrackerAPI.interceptors.request.use((req) => {
    req.baseURL = `https://api.teztracker.com/v2/data/tezos/${network}`;
    return req;
  });

  const getBlocks = (offset = 0, limit = 15) =>
    tezTrackerAPI.get(`/blocks?limit=${limit}&offset=${offset}`);

  const getBlock = (id) => tezTrackerAPI.get(`/blocks/${id}`);

  const getHead = () => tezTrackerAPI.get(`/blocks/head`);

  const stateValue = useMemo(
    () => ({
      getBlocks,
      getBlock,
      getHead,
    }),
    [getBlocks, getBlock, getHead],
  );

  return (
    <APIStateContext.Provider value={stateValue}>
      {children}
    </APIStateContext.Provider>
  );
};

APIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useAPIState, APIProvider };
