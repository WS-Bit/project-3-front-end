import React from 'react';
import styles from './styles/FancyLoading.module.css';

const FancyLoading: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default FancyLoading;