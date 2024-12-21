import React, { Dispatch, SetStateAction, ReactElement } from 'react';
import { AuthMethodsLib } from './AuthMethods';
import { WebAuthnLib } from './WebAuthn';
import { StytchOTPLib } from './StytchOTP';
import { WalletMethodsLib } from './WalletMethods';

export type LoginView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';
export type SetLoginView = Dispatch<SetStateAction<LoginView>>;

export interface LoginMethodsLibProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  authWithStytch: (accessToken: string, userId: string, method: string) => Promise<void>;
  authWithEthWallet: (connector: any) => Promise<void>;
  authWithWebAuthn: () => Promise<void>;
  onSendCode: (userId: string, method: 'email' | 'phone') => Promise<{ methodId: string }>;
  onVerifyCode: (code: string, methodId: string) => Promise<{ sessionJwt: string; userId: string }>;
  connectors: any[];
  error?: Error;
}

export const LoginMethodsLib = ({
  handleGoogleLogin,
  handleDiscordLogin,
  authWithStytch,
  authWithEthWallet,
  authWithWebAuthn,
  onSendCode,
  onVerifyCode,
  connectors,
  error,
}) => {
  const [view, setView] = React.useState<LoginView>('default');
  const handleSetView = (newView: LoginView) => setView(newView);

  return ((): JSX.Element => (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        {view === 'default' && (
          <AuthMethodsLib
            handleGoogleLogin={handleGoogleLogin}
            handleDiscordLogin={handleDiscordLogin}
            setView={handleSetView}
          />
        )}
        {view === 'email' && (
          <StytchOTPLib
            method="email"
            authWithStytch={authWithStytch}
            setView={handleSetView}
            onSendCode={onSendCode}
            onVerifyCode={onVerifyCode}
          />
        )}
        {view === 'phone' && (
          <StytchOTPLib
            method="phone"
            authWithStytch={authWithStytch}
            setView={handleSetView}
            onSendCode={onSendCode}
            onVerifyCode={onVerifyCode}
          />
        )}
        {view === 'wallet' && (
          <WalletMethodsLib
            connectors={connectors}
            authWithEthWallet={authWithEthWallet}
            setView={setView}
          />
        )}
        {view === 'webauthn' && (
          <WebAuthnLib
            start="authenticate"
            authWithWebAuthn={authWithWebAuthn}
            setView={setView}
            registerWithWebAuthn={() => {}}  // Provide empty function since it's not used in login
          />
        )}
      </div>
    </div>
  ))();
};
