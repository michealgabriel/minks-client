import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

    <Auth0Provider domain="dev-zr84h7r2.us.auth0.com" clientId="dhWWn1S7GGyntmQL93v1LbxVkkInxqAD" redirectUri={window.location.origin} useRefreshTokens={true} cacheLocation="localstorage">
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </Auth0Provider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
