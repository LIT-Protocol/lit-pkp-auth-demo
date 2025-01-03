import { useCallback, useState } from 'react';
import { AuthMethod, IRelayPKP, SessionSigs, LIT_NETWORKS_KEYS, AuthCallback, AuthCallbackParams, AuthSig } from '@lit-protocol/types';
import { LitPKPResource } from '@lit-protocol/auth-helpers';
import { LIT_ABILITY } from '@lit-protocol/constants';
import { LitAuthClient } from '../core/auth';

export interface UseLitAuthConfig {
  litNetwork: LIT_NETWORKS_KEYS;
  debug?: boolean;
  domain?: string;
  origin?: string;
  redirectUri?: string;
  stytchProjectId?: string;
}

export function useLitAuth(config: UseLitAuthConfig) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [accounts, setAccounts] = useState<IRelayPKP[]>([]);
  const [currentAccount, setCurrentAccount] = useState<IRelayPKP>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const client = new LitAuthClient(config);

  const handleAuth = useCallback(async (
    authFn: () => Promise<AuthMethod>
  ) => {
    setLoading(true);
    setError(undefined);
    try {
      const method = await authFn();
      setAuthMethod(method);
      
      // Fetch PKPs for this auth method
      const pkps = await client.getPKPs(method);
      setAccounts(pkps);
      
      if (pkps.length === 1) {
        setCurrentAccount(pkps[0]);
        
        // Get session signatures
        const sigs = await client.getSessionSigs({
          pkpPublicKey: pkps[0].publicKey,
          authMethod: method,
          sessionSigsParams: {
            chain: 'ethereum',
            resourceAbilityRequests: [{
              resource: new LitPKPResource('*'),
              ability: LIT_ABILITY.PKPSigning
            }],
            expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
            authNeededCallback: ((params: AuthCallbackParams): Promise<AuthSig> => {
              console.log('Additional auth needed:', params);
              // Create a basic AuthSig for the session
              return Promise.resolve({
                sig: 'session_sig',
                derivedVia: 'litSessionSignViaNacl',
                signedMessage: params.statement || 'lit_auth_message',
                address: '0x0', // This will be replaced with the actual session key
                algo: 'eth_signTypedData'
              });
            })
          }
        });
        setSessionSigs(sigs);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [client]);

  const authenticateWithGoogle = useCallback(() => {
    return handleAuth(() => client.authenticateWithGoogle());
  }, [client, handleAuth]);

  const authenticateWithDiscord = useCallback(() => {
    return handleAuth(() => client.authenticateWithDiscord());
  }, [client, handleAuth]);

  const authenticateWithEthWallet = useCallback((
    address?: string,
    signMessage?: (message: string) => Promise<string>
  ) => {
    return handleAuth(() => client.authenticateWithEthWallet(address, signMessage));
  }, [client, handleAuth]);

  const authenticateWithWebAuthn = useCallback(() => {
    return handleAuth(() => client.authenticateWithWebAuthn());
  }, [client, handleAuth]);

  const authenticateWithStytch = useCallback((
    accessToken: string,
    userId?: string,
    method?: 'email' | 'sms'
  ) => {
    return handleAuth(() => client.authenticateWithStytch(accessToken, userId, method));
  }, [client, handleAuth]);

  const createAccount = useCallback(async () => {
    if (!authMethod) return;
    
    setLoading(true);
    setError(undefined);
    try {
      const newPKP = await client.mintPKP(authMethod);
      setAccounts(prev => [...prev, newPKP]);
      setCurrentAccount(newPKP);
      
      // Get session signatures for new PKP
      const sigs = await client.getSessionSigs({
        pkpPublicKey: newPKP.publicKey,
        authMethod,
        sessionSigsParams: {
          chain: 'ethereum',
          resourceAbilityRequests: [{
            resource: new LitPKPResource('*'),
            ability: LIT_ABILITY.PKPSigning
          }],
          expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
          authNeededCallback: ((params: AuthCallbackParams): Promise<AuthSig> => {
            console.log('Additional auth needed:', params);
            // Create a basic AuthSig for the session
            return Promise.resolve({
              sig: 'session_sig',
              derivedVia: 'litSessionSignViaNacl',
              signedMessage: params.statement || 'lit_auth_message',
              address: '0x0', // This will be replaced with the actual session key
              algo: 'eth_signTypedData'
            });
          })
        }
      });
      setSessionSigs(sigs);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [authMethod, client]);

  return {
    authenticateWithGoogle,
    authenticateWithDiscord,
    authenticateWithEthWallet,
    authenticateWithWebAuthn,
    authenticateWithStytch,
    createAccount,
    setCurrentAccount,
    authMethod,
    sessionSigs,
    accounts,
    currentAccount,
    loading,
    error
  };
}
