import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import App from './App';
import './i18n';

import { AuthenticationResult, EventType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

// MSALは、再レンダリング時に再定義されないように、コンポーネント・ツリーの外側でインスタンス化する必要があります。
const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  // アカウント選択ロジックはアプリに依存します。用途に応じて調整してください。
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  // サインインイベントをリッスンし、アクティブアカウントを設定する
  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  });

  ReactDOM.render(
    <React.StrictMode>
      <HelmetProvider>
        <Helmet>
          <title>{process.env.REACT_APP_PAGE_TITLE}</title>
        </Helmet>
        <App msalInstance={msalInstance} />
      </HelmetProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
});
