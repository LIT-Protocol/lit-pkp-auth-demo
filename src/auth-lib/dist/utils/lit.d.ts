import { LIT_NETWORKS } from '@lit-protocol/constants';
import { AuthMethod, GetSessionSigsProps, IRelayPKP, SessionSigs } from '@lit-protocol/types';
export interface LitConfig {
    relayUrl?: string;
    network?: keyof typeof LIT_NETWORKS;
    debug?: boolean;
    stytchProjectId?: string;
}
export declare function initLitClient(config?: LitConfig): void;
export declare function authenticateWithGoogle(redirectUri: string): Promise<AuthMethod>;
export declare function authenticateWithDiscord(redirectUri: string): Promise<AuthMethod>;
export declare function authenticateWithEthWallet(address: string, signMessage: (message: string) => Promise<string>): Promise<AuthMethod>;
export declare function authenticateWithWebAuthn(): Promise<AuthMethod>;
export declare function authenticateWithStytch(accessToken: string, userId?: string, method?: string): Promise<AuthMethod>;
export declare function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP>;
export declare function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]>;
export declare function getSessionSigs(props: GetSessionSigsProps): Promise<SessionSigs>;
