// Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { Release } from '../interfaces/types';

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
            {!user && <Link to="/signup" className='navbar-item'>Signup</Link>}
            {!user && <Link to="/login" className='navbar-item'>Login</Link>}
            {user && <Link to="/your-page" className='navbar-item'>Your Page</Link>}
            <Link to="/releases" className='navbar-item'>All Releases</Link>
            <Link to="/artists" className='navbar-item'>All Artists</Link>
            {user && <Link to="/releases/new" className='navbar-item'>Create Release</Link>}
            {user && <Link to="/artists/new" className='navbar-item'>Create Artist</Link>}
            {user && (
              <button onClick={logout} className="navbar-item button is-primary is-ghost">
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;