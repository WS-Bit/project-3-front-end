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

const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
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
            <Link to="/" className='navbar-item'>Home</Link>
            <Link to="/releases" className='navbar-item'>All Releases</Link>
            <Link to="/artists" className='navbar-item'>All Artists</Link>
            
            {!user && (
              <>
                <Link to="/signup" className='navbar-item'>Signup</Link>
                <Link to="/login" className='navbar-item'>Login</Link>
              </>
            )}
            
            {user && (
              <>
                <Link to={`/user/${user?._id}/profile`} className='navbar-item'><h1>{user.username ? `${user.username}'s Profile` : 'User Profile'}</h1></Link>
                <Link to="/releases/new" className='navbar-item'>Create Release</Link>
                <Link to="/artists/new" className='navbar-item'>Create Artist</Link>
                <button onClick={logout} className="navbar-item button is-primary is-ghost">
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