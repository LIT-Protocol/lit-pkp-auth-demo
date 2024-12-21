import { AuthMethod, IRelayPKP, SessionSigs } from '@lit-protocol/types';
export interface UseLitSessionProps {
    sessionDuration?: number;
}
export declare function useLitSession({ sessionDuration }?: UseLitSessionProps): {
    initSession: (authMethod: AuthMethod, pkp: IRelayPKP) => Promise<void>;
    sessionSigs: SessionSigs;
    loading: boolean;
    error: Error;
};
