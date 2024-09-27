import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import 'bulma/css/bulma.min.css';

import 'bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css';

import './styles/custom.scss';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}