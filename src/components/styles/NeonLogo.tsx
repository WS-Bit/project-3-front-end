import React from 'react';
import { Link } from 'react-router-dom';
import './NeonLogo.css';

interface NeonLogoProps {
  size?: 'small' | 'large';
  isLink?: boolean;
}

const NeonLogo = ({ size = 'small', isLink = true }: NeonLogoProps): React.ReactElement => {
  const logoContent = (
    <div className={`neon-logo ${size}`}>
      <span className="neon-text">MELODY</span>
      <span className="neon-text">MEMO</span>
    </div>
  );

  return isLink ? (
    <Link to="/" className="navbar-item">
      {logoContent}
    </Link>
  ) : logoContent;
};

export default NeonLogo;