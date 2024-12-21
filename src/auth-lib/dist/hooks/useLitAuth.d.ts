import { AuthMethod } from '@lit-protocol/types';
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
export declare function useLitAuth({ redirectUri, onConnect }?: UseLitAuthProps): {
    authWithGoogle: () => Promise<void>;
    authWithDiscord: () => Promise<void>;
    authWithEthWallet: (connector: any) => Promise<void>;
    authWithWebAuthn: () => Promise<void>;
    authWithStytch: (accessToken: string, userId?: string, method?: string) => Promise<void>;
    authMethod: AuthMethod;
    loading: boolean;
    error: Error;
};
