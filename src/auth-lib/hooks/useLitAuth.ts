import { useCallback, useEffect, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { isSignInRedirect, getProviderFromUrl } from '@lit-protocol/lit-auth-client';
import {
  authenticateWithGoogle,
  authenticateWithDiscord,
  authenticateWithEthWallet,
  authenticateWithWebAuthn,
  authenticateWithStytch,
} from '../utils/lit';

export interface WalletConnector {
  getSigner: () => Promise<{
    signMessage: (message: string) => Promise<string>;
  }>;
}

export interface UseLitAuthProps {
  redirectUri?: string;
  onConnect?: (connector: any) => Promise<{
    account: string;
    connector: WalletConnector;
  }>;
}

export default function useLitAuth({ redirectUri, onConnect }: UseLitAuthProps = {}) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  /**
   * Handle redirect from Google OAuth
   */
  const authWithGoogle = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    setAuthMethod(undefined);

    try {
      const result: AuthMethod = await authenticateWithGoogle(redirectUri as string);
      setAuthMethod(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [redirectUri]);

  /**
   * Handle redirect from Discord OAuth
   */
  const authWithDiscord = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    setAuthMethod(undefined);

    try {
      const result: AuthMethod = await authenticateWithDiscord(redirectUri as string);
      setAuthMethod(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [redirectUri]);

  /**
   * Authenticate with Ethereum wallet
   */
  const authWithEthWallet = useCallback(
    async (connector: any): Promise<void> => {
      setLoading(true);
      setError(undefined);
      setAuthMethod(undefined);

      try {
        if (!onConnect) {
          throw new Error('onConnect callback is required for wallet authentication');
        }

        const { account, connector: activeConnector } = await onConnect(connector);
        const signer = await activeConnector.getSigner();
        const signMessage = async (message: string) => {
          const sig = await signer.signMessage(message);
          return sig;
        };
        const result: AuthMethod = await authenticateWithEthWallet(
          account,
          signMessage
        );
        setAuthMethod(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [onConnect]
  );

  /**
   * Authenticate with WebAuthn credential
   */
  const authWithWebAuthn = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    setAuthMethod(undefined);

    try {
      const result: AuthMethod = await authenticateWithWebAuthn();
      setAuthMethod(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Authenticate with Stytch
   */
  const authWithStytch = useCallback(
    async (accessToken: string, userId?: string, method?: string): Promise<void> => {
      setLoading(true);
      setError(undefined);
      setAuthMethod(undefined);

      try {
        const result: AuthMethod = await authenticateWithStytch(
          accessToken,
          userId,
          method
        );
        setAuthMethod(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handleRedirect = async () => {
      if (!redirectUri) return;
      
      try {
        if (isSignInRedirect(redirectUri)) {
          const provider = getProviderFromUrl();
          if (provider === 'google') {
            await authWithGoogle();
          } else if (provider === 'discord') {
            await authWithDiscord();
          }
        }
      } catch (err) {
        setError(err);
      }
    };

    handleRedirect();
  }, [redirectUri, authWithGoogle, authWithDiscord]);

  return {
    authWithGoogle,
    authWithDiscord,
    authWithEthWallet,
    authWithWebAuthn,
    authWithStytch,
    authMethod,
    loading,
    error,
  };
}
