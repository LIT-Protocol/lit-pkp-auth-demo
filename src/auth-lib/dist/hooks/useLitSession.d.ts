import { AuthMethod, IRelayPKP, SessionSigs } from '@lit-protocol/types';
export interface UseLitSessionProps {
    sessionDuration?: number;
}
export default function useLitSession({ sessionDuration }?: UseLitSessionProps): {
    initSession: (authMethod: AuthMethod, pkp: IRelayPKP) => Promise<void>;
    sessionSigs: SessionSigs | undefined;
    loading: boolean;
    error: Error | undefined;
};
