import { Configuration, LogLevel, PopupRequest } from '@azure/msal-browser';

const CLIENT_ID = '4c70f586-4448-4745-bcf2-da1f2ecb1dd6';
const AUTHORITY = '061059ee-7b3c-48b1-9174-9ba871ea10f7'; //テナントID
const BASE_URI = 'https://localhost:3000';

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID, // これは必須項目です。
    authority: `https://login.microsoftonline.com/${AUTHORITY}`, // プレースホルダーをテナントのサブドメインに置き換える。
    redirectUri: `${BASE_URI}/redirect`, // window.location.originを指す。この URI は Azure Portal/App Registration で登録する必要があります。
    postLogoutRedirectUri: `${BASE_URI}`, // ログアウト後に移動するページを示します。
    navigateToLoginRequestUrl: false, // もし "true "なら、認証コード応答を処理する前に、元のリクエストの場所にナビゲートする。
  },
  cache: {
    cacheLocation: 'sessionStorage', // キャッシュの場所を設定する。"sessionStorage "の方がより安全ですが、"localStorage "はタブ間のSSOを可能にします。
    storeAuthStateInCookie: true, // IE11 または Edge で問題がある場合は、"true" に設定してください。
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest: PopupRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
