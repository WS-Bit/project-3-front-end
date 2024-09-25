import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="hero is-darkest is-fullheight-with-navbar">
      <div className="hero-body has-text-centered">
        <div className="container">
          <h1 className="title is-1 animated-title">Melody Memo</h1><br/>
          <h2 className="subtitle is-4">Album Logging, Sharing and Loving</h2><br/>
          <p className="subtitle is-5">
            Upload your favourite albums and share your thoughts
          </p>
          <div className="button-container">
            <Link to="/signup" className="button is-warning is-large">Signup</Link>
            <Link to="/login" className="button is-warning is-large">Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;