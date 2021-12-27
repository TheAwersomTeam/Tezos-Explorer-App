import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const NetworkStateContext = createContext('');
NetworkStateContext.displayName = 'Network Context';

const useNetworkState = () => {
  const context = useContext(NetworkStateContext);

  if (!context) {
    throw new Error('useNetworkState must be used within a NetworkProvider');
  }

  return context;
};

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
      handleSetNetwork,
    }),
    [network, handleSetNetwork],
  );

  return (
    <NetworkStateContext.Provider value={stateValue}>
      {children}
    </NetworkStateContext.Provider>
  );
};

NetworkProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useNetworkState, NetworkProvider };
