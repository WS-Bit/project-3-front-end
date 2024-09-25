import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Release } from '../interfaces/types';
import styles from './Pagination.module.css';

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

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  }

  return (
    <header>
      <nav className='navbar is-dark'>
        <div className='container'>
          <div className='navbar-brand'>
            <Link to="/" className={`navbar-item button ${styles.yellowLink}`}>Home</Link>
            <Link to="/releases" className={`navbar-item button ${styles.yellowLink}`}>All Releases</Link>
            <Link to="/artists" className={`navbar-item button ${styles.yellowLink}`}>All Artists</Link>
            
            {!user && (
              <>
                <Link to="/signup" className={`navbar-item button ${styles.yellowLink}`}>Signup</Link>
                <Link to="/login" className={`navbar-item button ${styles.yellowLink}`}>Login</Link>
              </>
            )}
            
            {user && (
              <>
                <Link to={`/user/${user?._id}/profile`} className={`navbar-item button ${styles.yellowLink}`}><h1>{user.username ? `${user.username}'s Profile` : 'User Profile'}</h1></Link>
                <Link to="/artists/new" className={`navbar-item button ${styles.yellowLink}`}>Create Artist</Link>
                <Link to="/releases/new" className={`navbar-item button ${styles.yellowLink}`}>Create Release</Link>
                <button onClick={logout} className={`navbar-item button ${styles.yellowLink}`}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;