import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import App from './App';
import './i18n';

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>{process.env.REACT_APP_PAGE_TITLE}</title>
      </Helmet>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
