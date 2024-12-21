import React from 'react';
import { AuthMethodsLib } from './AuthMethods';
import { WebAuthnLib } from './WebAuthn';
import { StytchOTPLib } from './StytchOTP';
import { WalletMethodsLib } from './WalletMethods';

export type SignUpView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

export interface SignUpMethodsLibProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  authWithStytch: (accessToken: string, userId: string, method: string) => Promise<void>;
  authWithEthWallet: (connector: any) => Promise<void>;
  registerWithWebAuthn: () => Promise<void>;
  authWithWebAuthn: () => Promise<void>;
  onSendCode: (userId: string, method: 'email' | 'phone') => Promise<{ methodId: string }>;
  onVerifyCode: (code: string, methodId: string) => Promise<{ sessionJwt: string; userId: string }>;
  connectors: any[];
  error?: Error;
}

export const SignUpMethodsLib: React.FC<SignUpMethodsLibProps> = ({
  handleGoogleLogin,
  handleDiscordLogin,
  authWithStytch,
  authWithEthWallet,
  registerWithWebAuthn,
  authWithWebAuthn,
  onSendCode,
  onVerifyCode,
  connectors,
  error,
}) => {
  const [view, setView] = React.useState<SignUpView>('default');

  return (
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
            setView={setView}
          />
        )}
        {view === 'email' && (
          <StytchOTPLib
            method="email"
            authWithStytch={authWithStytch}
            setView={setView}
            onSendCode={onSendCode}
            onVerifyCode={onVerifyCode}
          />
        )}
        {view === 'phone' && (
          <StytchOTPLib
            method="phone"
            authWithStytch={authWithStytch}
            setView={setView}
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
            start="register"
            authWithWebAuthn={authWithWebAuthn}
            registerWithWebAuthn={registerWithWebAuthn}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
};
