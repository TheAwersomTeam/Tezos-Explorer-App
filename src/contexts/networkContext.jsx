import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const NetworkStateContext = createContext('');
NetworkStateContext.displayName = 'NetworkStateContext';

const NetworkDispatchContext = createContext('');
NetworkDispatchContext.displayName = 'NetworkDispatchContext';

const NetworkProvider = ({ children }) => {
  const [network, setNetwork] = useState('mainnet');

  let handleSetNetwork;

  try {
    const storage = localStorage;

    handleSetNetwork = (newNetwork) => {
      setNetwork(newNetwork);
      storage.setItem('network', newNetwork);
    };

    useEffect(() => {
      const storageNetwork = storage.getItem('network');

      return storageNetwork
        ? setNetwork(storageNetwork)
        : storage.setItem('network', 'mainnet');
    }, []);
  } catch {
    handleSetNetwork = (newNetwork) => setNetwork(newNetwork);
  }

  const stateValue = useMemo(
    () => ({
      network,
    }),
    [network],
  );

  const dispatchValue = useMemo(
    () => ({
      handleSetNetwork,
    }),
    [handleSetNetwork],
  );

  return (
    <NetworkStateContext.Provider value={stateValue}>
      <NetworkDispatchContext.Provider value={dispatchValue}>
        {children}
      </NetworkDispatchContext.Provider>
    </NetworkStateContext.Provider>
  );
};

NetworkProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useNetworkStateContext = () => {
  const context = useContext(NetworkStateContext);

  if (!context) {
    throw new Error(
      'useNetworkStateContext must be used within a NetworkProvider',
    );
  }

  return context;
};

const useNetworkDispatchContext = () => {
  const context = useContext(NetworkDispatchContext);

  if (!context) {
    throw new Error(
      'useNetworkDispatchContext must be used within a NetworkProvider',
    );
  }

  return context;
};

export { useNetworkStateContext, useNetworkDispatchContext, NetworkProvider };
