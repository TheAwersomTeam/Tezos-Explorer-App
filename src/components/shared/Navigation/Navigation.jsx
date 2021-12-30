import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';

import styles from './Navigation.module.scss';
import {
  useThemeStateContext,
  useThemeDispatchContext,
} from '../../../contexts/themeContext';
import {
  useNetworkStateContext,
  useNetworkDispatchContext,
} from '../../../contexts/networkContext';

import { ReactComponent as Home } from '../../../images/home.svg';
import { ReactComponent as Blocks } from '../../../images/block.svg';
import { ReactComponent as Bakers } from '../../../images/backers.svg';
import { ReactComponent as Chart } from '../../../images/charts.svg';
import { ReactComponent as Ecosystem } from '../../../images/ecosystem.svg';
import { ReactComponent as Sun } from '../../../images/sun.svg';
import { ReactComponent as Moon } from '../../../images/moon.svg';

const NAVIGATION_CONFIG = [
  { content: 'Home', path: '/home', withDropdown: false },
  { content: 'Blocks', path: '/blocks', withDropdown: false },
  { content: 'Bakers', path: '/backers', withDropdown: true },
  { content: 'Chart', path: '/charts', withDropdown: false },
];

const ASIDE_CONFIG = [
  { content: 'Home', path: '/home', withDropdown: false, Icon: Home },
  { content: 'Blocks', path: '/blocks', withDropdown: true, Icon: Blocks },
  { content: 'Bakers', path: '/backers', withDropdown: true, Icon: Bakers },
  { content: 'Chart', path: '/charts', withDropdown: false, Icon: Chart },
  {
    content: 'Ecosystem',
    path: '/ecosystem',
    withDropdown: true,
    Icon: Ecosystem,
  },
];

const Navigation = ({ isAside }) => {
  const { theme } = useThemeStateContext();
  const { handleSetTheme } = useThemeDispatchContext();
  const { network } = useNetworkStateContext();
  const { handleSetNetwork } = useNetworkDispatchContext();
  const history = useHistory();

  const toggleTheme = () =>
    theme === 'light' ? handleSetTheme('dark') : handleSetTheme('light');
  const changeNetwork = (e) => {
    history.push('/');
    handleSetNetwork(e.target.value);
  };

  if (isAside) {
    return (
      <nav className={`${styles['aside-nav']}`}>
        <ul className={styles['aside-nav__list']}>
          {ASIDE_CONFIG.map((item) => {
            const { content, path, withDropdown, Icon } = item;

            return (
              <li className={styles['aside-nav__item']} key={content}>
                <Icon className={styles['aside-nav__icon']} />
                <Link
                  to={path}
                  className={withDropdown ? 'arrow arrow--d--down' : null}
                >
                  {content}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav className={styles.navigation}>
      <ul className={styles.navigation__list}>
        {NAVIGATION_CONFIG.map((navItem) => {
          const { content, path, withDropdown } = navItem;

          return (
            <li key={content}>
              <Link
                to={path}
                className={withDropdown ? 'arrow arrow--d--down' : null}
              >
                {content}
              </Link>
            </li>
          );
        })}
        <li>
          <select
            name="network"
            onChange={changeNetwork}
            className={styles.navigation__select}
            value={network}
          >
            <option value="mainnet">Mainnet</option>
            <option value="another">Another</option>
          </select>
        </li>
        <li>
          <button
            type="button"
            onClick={toggleTheme}
            className={styles.navigation__icon}
          >
            {theme === 'light' ? <Sun /> : <Moon />}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

Navigation.propTypes = {
  isAside: PropTypes.bool,
};

Navigation.defaultProps = {
  isAside: false,
};
