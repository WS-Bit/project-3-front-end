import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Import Bulma CSS
import 'bulma/css/bulma.min.css';

// Import Bulma Switch extension CSS
import 'bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css';

// Import your custom styles
import './styles/custom.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);