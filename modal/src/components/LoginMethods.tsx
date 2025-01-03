import React, { useState, JSX } from 'react';

import AuthMethods from './AuthMethods';
import WalletMethods from './WalletMethods';
import WebAuthn from './WebAuthn';
import StytchOTP from './StytchOTP';

import { AuthMethod, AuthView } from './Modal';

interface LoginProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  authWithEthWallet?: (connector: any) => Promise<void>;
  authWithWebAuthn: () => Promise<void>;
  registerWithWebAuthn?: () => Promise<void>;
  authWithStytch?: () => Promise<void>;
  signUp: () => void;
  error?: Error;
  enabledAuthMethods: AuthMethod[];
}

// AuthView type imported from Modal.tsx

const LoginMethods = ({
  handleGoogleLogin,
  handleDiscordLogin,
  authWithEthWallet,
  authWithWebAuthn,
  authWithStytch,
  signUp,
  error,
}: LoginProps): JSX.Element => {
  const [view, setView] = useState<AuthView>('default');

  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        {view === 'default' && (
          <>
            <h1>Welcome back</h1>
            <p>Access your Lit wallet.</p>
            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              setView={setView}
            />
            <div className="buttons-container">
              <button type="button" className="btn btn--link" onClick={signUp}>
                Need an account? Sign up
              </button>
            </div>
          </>
        )}
        {view === 'email' && (
          <StytchOTP
            method={'email'}
            authWithStytch={authWithStytch}
            setView={setView}
          />
        )}
        {view === 'phone' && (
          <StytchOTP
            method={'phone'}
            authWithStytch={authWithStytch}
            setView={setView}
          />
        )}
        {view === 'wallet' && (
          <WalletMethods
            authWithEthWallet={authWithEthWallet}
            setView={setView}
          />
        )}
        {view === 'webauthn' && (
          <WebAuthn
            start={'authenticate'}
            authWithWebAuthn={authWithWebAuthn}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
};

export default LoginMethods;
