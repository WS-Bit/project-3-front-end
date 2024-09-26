import React from 'react';
import { Link } from 'react-router-dom';
import NeonLogo from './NeonLogo';
import './Home.css';

const Home = () => {
  return (
    <section className="hero is-darkest is-fullheight-with-navbar">
      <div className="hero-body has-text-centered">
        <div className="container">
          <NeonLogo size="large" isLink={false} /><br/>
          <h2 className="home-subtitle is-3 mt-4">Add an artist, add their releases, leave reviews and mark your favourites</h2>
          <p className="home-subtitle is-5 mt-2">
            Upload your favourite albums and share your thoughts
          </p>
          <div className="button-container mt-5">
            <Link to="/signup" className="button is-warning mr-3">Signup</Link>
            <Link to="/login" className="button is-warning ">Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;