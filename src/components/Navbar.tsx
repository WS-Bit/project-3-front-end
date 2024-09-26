import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/melody-memo-logo.svg';
import { Release } from '../interfaces/types';
import styles from '../styles/Pagination.module.css';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  uploads?: Release[];
  favorites?: Release[];
}

interface NavbarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Navbar = ({ user, setUser }: NavbarProps) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  }

  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <img src={logo} alt="Melody Memo Logo" width="130" height="40" />
          </Link>

          <a 
            role="button" 
            className={`navbar-burger burger ${isActive ? 'is-active' : ''}`} 
            aria-label="menu" 
            aria-expanded="false" 
            onClick={() => setIsActive(!isActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
          <div className="navbar-start">
            <Link to="/" className={`navbar-item ${styles.yellowLink}`}>Home</Link>
            <Link to="/releases" className={`navbar-item ${styles.yellowLink}`}>All Releases</Link>
            <Link to="/artists" className={`navbar-item ${styles.yellowLink}`}>All Artists</Link>
          </div>

          <div className="navbar-end">
            {!user && (
              <>
                <Link to="/signup" className={`navbar-item ${styles.yellowLink}`}>Signup</Link>
                <Link to="/login" className={`navbar-item ${styles.yellowLink}`}>Login</Link>
              </>
            )}
            
            {user && (
              <>
                <Link to={`/user/${user?._id}/profile`} className={`navbar-item ${styles.yellowLink}`}>
                  {user.username ? `${user.username}'s Profile` : 'User Profile'}
                </Link>
                <Link to="/artists/new" className={`navbar-item ${styles.yellowLink}`}>Create Artist</Link>
                <Link to="/releases/new" className={`navbar-item ${styles.yellowLink}`}>Create Release</Link>
                <a onClick={logout} className={`navbar-item ${styles.yellowLink}`}>Logout</a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;