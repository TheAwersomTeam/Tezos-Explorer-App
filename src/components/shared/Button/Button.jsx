import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const Button = ({ buttonValue }) => {
  const [width, setWidth] = useState(window.innerWidth);

  // for testing
  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  // for testing end

  if (width <= 834) {
    return (
      <Link className={styles.button__link} to="/login" aria-label="Login" />
    );
  }

  return (
    <Link to="/login" className={styles.button}>
      {buttonValue}
    </Link>
  );
};

export default Button;

Button.propTypes = {
  buttonValue: PropTypes.string,
};

Button.defaultProps = {
  buttonValue: 'Login',
};
