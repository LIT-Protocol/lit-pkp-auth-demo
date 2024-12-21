import { useCallback, useState } from 'react';
import { AuthMethod, IRelayPKP, SessionSigs } from '@lit-protocol/types';
import { LitAbility, LitActionResource } from '@lit-protocol/auth-helpers';
import { getSessionSigs } from '../utils/lit';

export interface UseLitSessionProps {
  sessionDuration?: number; // Duration in milliseconds, defaults to 1 week
}

export default function useLitSession({ sessionDuration = 1000 * 60 * 60 * 24 * 7 }: UseLitSessionProps = {}) {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  /**
   * Generate session sigs and store new session data
   */
  const initSession = useCallback(
    async (authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        // Prepare session sigs params
        const chain = 'ethereum';
        const resourceAbilities = [
          {
            resource: new LitActionResource('*'),
            ability: LitAbility.PKPSigning,
          },
        ];
        const expiration = new Date(
          Date.now() + sessionDuration
        ).toISOString();

        // Generate session sigs
        const sessionSigs = await getSessionSigs({
          pkpPublicKey: pkp.publicKey,
          authMethod,
          sessionSigsParams: {
            chain,
            expiration,
            resourceAbilityRequests: resourceAbilities,
          },
        });

        setSessionSigs(sessionSigs);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [sessionDuration]
  );

  return {
    initSession,
    sessionSigs,
    loading,
    error,
  };
}
