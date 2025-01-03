import React, { useState, useEffect, JSX } from 'react';
import { LIT_NETWORKS_KEYS } from '@lit-protocol/types';
import AuthMethods from './AuthMethods';
import LoginMethods from './LoginMethods';
import SignUpMethods from './SignUpMethods';
import AccountSelection from './AccountSelection';
import Dashboard from './Dashboard';
import Loading from './Loading';
import type { IRelayPKP, SessionSigs } from '@lit-protocol/types';
import { useAuthenticate, UseAuthenticateProps } from '../hooks/useAuthenticate';
import { useSession } from '../hooks/useSession';
import { useAccounts } from '../hooks/useAccounts';
import {
  initLit,
  signInWithGoogle,
  signInWithDiscord,
  registerWebAuthn,
} from '../utils/lit';
import { ORIGIN } from '../utils/constants';

export type AuthMethod = 'google' | 'discord' | 'ethereum' | 'webauthn' | 'stytch';
export type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

/**
 * Configuration options for the PKP Auth Modal
 */
export interface PKPAuthModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback when the modal is closed */
  onClose: () => void;
  /** Callback when authentication is successful */
  onSuccess?: (data: { sessionSigs: any; pkp: any }) => void;
  /** Redirect URI for OAuth flows */
  redirectUri?: string;
  /** Lit Network to connect to */
  network?: LIT_NETWORKS_KEYS;
  /** Enable debug mode */
  debug?: boolean;
  /** Domain for authentication */
  domain?: string;
  /** Stytch project ID for email/phone auth */
  stytchProjectId?: string;
  /** Custom wallet connection handler */
  onConnect?: (connector: any) => Promise<{ account: string; signer: any }>;
  /** List of enabled authentication methods */
  enabledAuthMethods?: AuthMethod[];
}

const PKPAuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  redirectUri,
  network,
  debug,
  domain,
  stytchProjectId,
  onConnect,
  enabledAuthMethods = ['google', 'discord', 'ethereum', 'webauthn', 'stytch'] as AuthMethod[],
}: PKPAuthModalProps): JSX.Element => {
  const [view, setView] = useState<'login' | 'signup' | 'accounts' | 'dashboard'>('login');
  
  // Initialize Lit configuration
  React.useEffect(() => {
    initLit({
      network,
      debug,
      domain,
      redirectUri,
      stytchProjectId,
    });
  }, [network, debug, domain, redirectUri, stytchProjectId]);

  const {
    authWithEthWallet: rawAuthWithEthWallet,
    authWithWebAuthn: rawAuthWithWebAuthn,
    authWithStytch: rawAuthWithStytch,
    authMethod,
    loading: authLoading,
    error: authError,
  } = useAuthenticate({ redirectUri, onConnect });

  // Internal auth methods with full signatures
  const authWithEthWalletFull = async (connector?: any) => {
    if (!enabledAuthMethods.includes('ethereum')) return;
    await rawAuthWithEthWallet(connector);
  };
  const authWithWebAuthnFull = async (username?: string) => {
    if (!enabledAuthMethods.includes('webauthn')) return;
    await rawAuthWithWebAuthn(username);
  };
  const authWithStytchFull = async (accessToken: string, userId?: string, method?: string) => {
    if (!enabledAuthMethods.includes('stytch')) return;
    await rawAuthWithStytch(accessToken, userId, method);
  };

  // Simplified auth methods for component props
  const authWithEthWallet = async () => {
    await authWithEthWalletFull(undefined);
  };
  const authWithWebAuthn = async () => {
    await authWithWebAuthnFull();
  };
  const authWithStytch = async () => {
    await authWithStytchFull('', '', '');
  };

  const {
    initSession,
    sessionSigs,
    loading: sessionLoading,
    error: sessionError,
  } = useSession();

  const {
    fetchAccounts,
    createAccount,
    setCurrentAccount,
    accounts,
    currentAccount,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();

  React.useEffect(() => {
    if (authMethod) {
      fetchAccounts(authMethod);
      setView('accounts');
    }
  }, [authMethod, fetchAccounts]);

  React.useEffect(() => {
    if (currentAccount && authMethod) {
      initSession(authMethod, currentAccount);
    }
  }, [currentAccount, authMethod, initSession]);

  React.useEffect(() => {
    if (sessionSigs && currentAccount && onSuccess) {
      onSuccess({ sessionSigs, pkp: currentAccount });
    }
  }, [sessionSigs, currentAccount, onSuccess]);

  if (!isOpen) return null;

  const loading = authLoading || sessionLoading || accountsLoading;
  const error = authError || sessionError || accountsError;

  return (
    <div className="lit-modal-overlay">
      <div className="lit-modal">
        <button className="lit-modal__close" onClick={onClose}>×</button>
        {loading ? (
          <Loading copy="Please wait..." error={error} />
        ) : (
          <>
            {view === 'login' && (
              <LoginMethods
                handleGoogleLogin={async () => {
                  if (!enabledAuthMethods.includes('google')) return;
                  try {
                    await signInWithGoogle(redirectUri || ORIGIN);
                  } catch (err) {
                    console.error('Google login error:', err);
                  }
                }}
                handleDiscordLogin={async () => {
                  if (!enabledAuthMethods.includes('discord')) return;
                  try {
                    await signInWithDiscord(redirectUri || ORIGIN);
                  } catch (err) {
                    console.error('Discord login error:', err);
                  }
                }}
                authWithEthWallet={enabledAuthMethods.includes('ethereum') ? authWithEthWallet : undefined}
                authWithWebAuthn={enabledAuthMethods.includes('webauthn') ? authWithWebAuthn : undefined}
                registerWithWebAuthn={enabledAuthMethods.includes('webauthn') ? () => Promise.resolve() : undefined}
                authWithStytch={enabledAuthMethods.includes('stytch') ? authWithStytch : undefined}
                signUp={() => setView('signup')}
                error={error}
                enabledAuthMethods={enabledAuthMethods}
              />
            )}
            {view === 'signup' && (
              <SignUpMethods
                handleGoogleLogin={async () => {
                  if (!enabledAuthMethods.includes('google')) return;
                  try {
                    await signInWithGoogle(redirectUri || ORIGIN);
                  } catch (err) {
                    console.error('Google login error:', err);
                  }
                }}
                handleDiscordLogin={async () => {
                  if (!enabledAuthMethods.includes('discord')) return;
                  try {
                    await signInWithDiscord(redirectUri || ORIGIN);
                  } catch (err) {
                    console.error('Discord login error:', err);
                  }
                }}
                authWithEthWallet={enabledAuthMethods.includes('ethereum') ? authWithEthWallet : undefined}
                registerWithWebAuthn={async () => {
                  if (!enabledAuthMethods.includes('webauthn')) return;
                  try {
                    const newPKP = await registerWebAuthn();
                    if (newPKP) {
                      setCurrentAccount(newPKP);
                      setView('dashboard');
                    }
                  } catch (err) {
                    console.error('WebAuthn registration error:', err);
                  }
                }}
                authWithWebAuthn={enabledAuthMethods.includes('webauthn') ? authWithWebAuthn : undefined}
                authWithStytch={enabledAuthMethods.includes('stytch') ? authWithStytch : undefined}
                goToLogin={() => setView('login')}
                error={error}
                enabledAuthMethods={enabledAuthMethods}
              />
            )}
            {view === 'accounts' && accounts && (
              <AccountSelection
                accounts={accounts}
                setCurrentAccount={setCurrentAccount}
                error={error}
              />
            )}
            {view === 'dashboard' && currentAccount && sessionSigs && (
              <Dashboard
                currentAccount={currentAccount}
                sessionSigs={sessionSigs}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PKPAuthModal;
