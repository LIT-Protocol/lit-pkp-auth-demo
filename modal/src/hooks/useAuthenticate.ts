import { useCallback, useState, useEffect } from 'react';
import {
  isSignInRedirect,
  getProviderFromUrl,
} from '@lit-protocol/lit-auth-client';
import { AuthMethod } from '@lit-protocol/types';
import {
  authenticateWithGoogle,
  authenticateWithDiscord,
  authenticateWithEthWallet,
  authenticateWithWebAuthn,
  authenticateWithStytch,
} from '../utils/lit';

export interface UseAuthenticateProps {
  redirectUri?: string;
  onConnect?: (connector: any) => Promise<{ account: string; signer: any }>;
}

export function useAuthenticate({ redirectUri, onConnect }: UseAuthenticateProps) {
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
      const result: AuthMethod = (await authenticateWithGoogle(
        redirectUri as any
      )) as any;
      setAuthMethod(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
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
      const result: AuthMethod = (await authenticateWithDiscord(
        redirectUri as any
      )) as any;
      setAuthMethod(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
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
        if (!onConnect) throw new Error('onConnect callback is required for wallet authentication');
        const { account, signer } = await onConnect(connector);
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
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [onConnect]
  );

  /**
   * Authenticate with WebAuthn credential
   */
  const authWithWebAuthn = useCallback(
    async (username?: string): Promise<void> => {
      setLoading(true);
      setError(undefined);
      setAuthMethod(undefined);

      try {
        const result: AuthMethod = await authenticateWithWebAuthn();
        setAuthMethod(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Authenticate with Stytch
   */
  const authWithStytch = useCallback(
    async (accessToken: string, userId?: string, method?: string): Promise<void> => {
      setLoading(true);
      setError(undefined);
      setAuthMethod(undefined);

      try {
        const result: AuthMethod = (await authenticateWithStytch(
          accessToken,
          userId,
          method
        )) as any;
        setAuthMethod(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // Check if user is redirected from social login
    if (redirectUri && isSignInRedirect(redirectUri)) {
      // If redirected, authenticate with social provider
      const providerName = getProviderFromUrl();
      if (providerName === 'google') {
        authWithGoogle();
      } else if (providerName === 'discord') {
        authWithDiscord();
      }
    }
  }, [redirectUri, authWithGoogle, authWithDiscord]);

  return {
    authWithEthWallet,
    authWithWebAuthn,
    authWithStytch,
    authMethod,
    loading,
    error,
  };
}
