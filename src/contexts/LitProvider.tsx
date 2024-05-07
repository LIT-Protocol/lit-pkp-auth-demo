import { createContext, useEffect, useState } from 'react';

import { LitAuthClient } from '@lit-protocol/lit-auth-client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitNodeClientConfig } from '@lit-protocol/types';

export type LitContextType = {
    litNodeClient: LitNodeClient;
    litAuthClient: LitAuthClient;
};

export const LitContext = createContext<LitContextType | undefined>(undefined);

export function LitProvider({ clientConfig, children }: { clientConfig: LitNodeClientConfig, children: React.ReactNode }) {
    const [litNodeClient, setLitNodeClient] = useState<LitNodeClient | null>(null);
    const [litAuthClient, setLitAuthClient] = useState<LitAuthClient | null>(null);

    // console.log('Lit Provider clientConfig: ', clientConfig)

    /*
     * Initialize LitNodeClient and LitAuthClient
     */
    useEffect(() => {
        const client = new LitNodeClient(clientConfig);
        const authClient = new LitAuthClient({
            litRelayConfig: {
                relayApiKey: 'test-api-key',
            },
            litNodeClient: client
        });

        // console.log('connecting to lit node');
        client.connect();
        setLitNodeClient(client);
        setLitAuthClient(authClient);

        return () => {
            /*
            * Disconnect from LitNodeClient before unmounting
            */
            // console.log('disconnecting from lit node');
            client.disconnect();
        }
    }, [clientConfig]);

    return (
        <LitContext.Provider value={{ litNodeClient, litAuthClient }}>
            {children}
        </LitContext.Provider >
    );
}