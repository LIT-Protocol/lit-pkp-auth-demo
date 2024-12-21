import React, { createContext, useContext, useState, useEffect } from 'react';
// @ts-ignore - ignoring type error as instructed
import * as LitNodeClient from '@lit-protocol/lit-node-client';
import { IRelayPKP, SessionSigs } from '@lit-protocol/types';
// @ts-ignore - ignoring type error as instructed
import * as LitAuthClient from '@lit-protocol/lit-auth-client';
// @ts-ignore - ignoring type error as instructed
import * as LitConst from '@lit-protocol/constants';

// @ts-ignore - ignoring type error as instructed
interface LitAuthContextType {
  // @ts-ignore - ignoring type error as instructed
  litNodeClient: any;
  // @ts-ignore - ignoring type error as instructed
  authClient: any;
  // @ts-ignore - ignoring type error as instructed
  session: any;
  // @ts-ignore - ignoring type error as instructed
  accounts: any[];
  authenticate: (method: string) => Promise<void>;
  loading: boolean;
}

const LitAuthContext = createContext<LitAuthContextType>({
  litNodeClient: null,
  authClient: null,
  session: null,
  accounts: [],
  authenticate: async () => {},
  loading: false,
});

export const useLitAuth = () => useContext(LitAuthContext);

export const LitAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // @ts-ignore - ignoring type error as instructed
  const [litNodeClient, setLitNodeClient] = useState(null);
  // @ts-ignore - ignoring type error as instructed
  const [authClient, setAuthClient] = useState(null);
  // @ts-ignore - ignoring type error as instructed
  const [session, setSession] = useState(null);
  // @ts-ignore - ignoring type error as instructed
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initClients = async () => {
      // @ts-ignore - ignoring type error as instructed
      const nodeClient = new LitNodeClient.LitNodeClient({
        // @ts-ignore - ignoring type error as instructed
        litNetwork: process.env.NEXT_PUBLIC_LIT_NETWORK || 'datil-dev',
      });
      await nodeClient.connect();
      setLitNodeClient(nodeClient);

      // @ts-ignore - ignoring type error as instructed
      const client = new LitAuthClient.LitAuthClient({
        litRelayConfig: {
          relayApiKey: process.env.NEXT_PUBLIC_LIT_RELAY_API_KEY,
        },
      });
      setAuthClient(client);
    };

    initClients();
  }, []);

  const authenticate = async (method: string) => {
    if (!authClient) return;
    setLoading(true);
    try {
      // Authentication logic will be implemented here
      // This is just a placeholder for now
      setLoading(false);
    } catch (err) {
      console.error('Error during authentication:', err);
      setLoading(false);
    }
  };

  const value = {
    litNodeClient,
    authClient,
    session,
    accounts,
    authenticate,
    loading,
  };

  return (
    <LitAuthContext.Provider value={value}>
      {children}
    </LitAuthContext.Provider>
  );
};
