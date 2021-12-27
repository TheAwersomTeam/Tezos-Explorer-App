import '../styles/index.scss';

import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from '../route/AppRouter';

import Header from './shared/Header';
import Footer from './shared/Footer';

import { NetworkProvider } from '../contexts/networkContext';
import { BlocksProvider } from '../contexts/blocksContext';
import { BlockProvider } from '../contexts/blockContext';
import { ThemeProvider } from '../contexts/themeContext';
import { APIProvider } from '../api/contextAPI';

const App = () => (
  <ThemeProvider>
    <ToastContainer />
    <NetworkProvider>
      <APIProvider>
        <BlocksProvider>
          <BlockProvider>
            <Router>
              <Header />
              <AppRouter />
              <Footer />
            </Router>
          </BlockProvider>
        </BlocksProvider>
      </APIProvider>
    </NetworkProvider>
  </ThemeProvider>
);

export default App;
