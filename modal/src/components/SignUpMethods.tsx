import React, { useState, JSX } from 'react';

import AuthMethods from './AuthMethods';
import WalletMethods from './WalletMethods';
import WebAuthn from './WebAuthn';
import StytchOTP from './StytchOTP';

import { AuthMethod, AuthView } from './Modal';

interface SignUpProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  authWithEthWallet?: (connector: any) => Promise<void>;
  registerWithWebAuthn?: () => Promise<void>;
  authWithWebAuthn?: () => Promise<void>;
  authWithStytch?: () => Promise<void>;
  goToLogin: () => void;
  error?: Error;
  enabledAuthMethods: AuthMethod[];
}

// AuthView type imported from Modal.tsx

const SignUpMethods = ({
  handleGoogleLogin,
  handleDiscordLogin,
  authWithEthWallet,
  registerWithWebAuthn,
  authWithWebAuthn,
  authWithStytch,
  goToLogin,
  error,
}: SignUpProps): JSX.Element => {
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
            <h1>Get started</h1>
            <p>
              Create a wallet that is secured by accounts you already have. With
              Lit-powered programmable MPC wallets, you won&apos;t have to worry
              about seed phrases.
            </p>
            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              setView={setView}
            />
            <div className="buttons-container">
              <button
                type="button"
                className="btn btn--link"
                onClick={goToLogin}
              >
                Have an account? Log in
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
            start={'register'}
            authWithWebAuthn={authWithWebAuthn}
            setView={setView}
            registerWithWebAuthn={registerWithWebAuthn}
          />
        )}
      </div>
    </div>
  );
};

export default SignUpMethods;
