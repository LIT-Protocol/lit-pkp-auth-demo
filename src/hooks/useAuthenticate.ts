import { useCallback, useEffect, useState } from 'react';
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
import { useConnect } from 'wagmi';
import { useLit } from './useLit';

export default function useAuthenticate(redirectUri?: string) {
  const { litAuthClient } = useLit();
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  // wagmi hook
  const { connectAsync } = useConnect({
    onError: (err: unknown) => {
      setError(err as Error);
    },
  });

  /**
   * Handle redirect from Google OAuth
   */
  const authWithGoogle = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    setAuthMethod(undefined);

    try {
      const result: AuthMethod = (await authenticateWithGoogle(
        litAuthClient,
        redirectUri as any
      )) as any;
      setAuthMethod(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [litAuthClient, redirectUri]);

  /**
   * Handle redirect from Discord OAuth
   */
  const authWithDiscord = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    setAuthMethod(undefined);

    try {
      const result: AuthMethod = (await authenticateWithDiscord(
        litAuthClient,
        redirectUri as any
      )) as any;
      setAuthMethod(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [litAuthClient, redirectUri]);

  /**
   * Authenticate with Ethereum wallet
   */
  const authWithEthWallet = useCallback(
    async (connector: any): Promise<void> => {
      setLoading(true);
      setError(undefined);
      setAuthMethod(undefined);

      try {
        const { account, connector: activeConnector } = await connectAsync(
          connector
        );
        const signer = await activeConnector.getSigner();
        const signMessage = async (message: string) => {
          const sig = await signer.signMessage(message);
          return sig;
        };
        const result: AuthMethod = await authenticateWithEthWallet(
          litAuthClient,
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
    [litAuthClient, connectAsync]
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
        const result: AuthMethod = await authenticateWithWebAuthn(litAuthClient);
        setAuthMethod(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [litAuthClient]
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
          litAuthClient,
          accessToken,
          userId,
          method
        )) as any;
        setAuthMethod(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [litAuthClient]
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
