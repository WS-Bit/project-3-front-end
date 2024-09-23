import React from 'react';

const Home = () => {
  return (
    <section className="hero is-warning is-fullheight-with-navbar">
      <div className="hero-body has-text-centered">
        <div className="container">
          <h1 className="title is-1">Melody Memo</h1>
          <h2 className="subtitle is-3">Album Logging, Sharing and Loving</h2>
          <p className="content is-large">
            Upload your favourite albums and share your thoughts
          </p><br/>
          <button className="button is-primary is-large">Get Started</button>
        </div>
      </div>
    </section>
  );
};

export default Home;