import { useCallback, useState } from 'react';
import { AuthMethod, IRelayPKP, SessionSigs, GetSessionSigsProps } from '@lit-protocol/types';
// Commenting out problematic import until dependency is fixed
// import { LitAbility, LitActionResource } from '@lit-protocol/auth-helpers';
import { getSessionSigs } from '../utils/lit';

// Temporary implementations until dependency is fixed
const LitAbility = {
  PKPSigning: 'pkp-signing'
} as const;

interface LitResourceAbilityRequest {
  resource: { resource: string };
  ability: string;
}

class LitActionResource {
  constructor(public resource: string) {}
  toJSON() {
    return { resource: this.resource };
  }
}

export interface UseLitSessionProps {
  sessionDuration?: number; // Duration in milliseconds, defaults to 1 week
}

export function useLitSession({ sessionDuration = 1000 * 60 * 60 * 24 * 7 }: UseLitSessionProps = {}) {
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
        const resourceAbilities: LitResourceAbilityRequest[] = [
          {
            resource: { resource: '*' },
            ability: LitAbility.PKPSigning,
          },
        ];
        const expiration = new Date(
          Date.now() + sessionDuration
        ).toISOString();

        // Generate session sigs
        const sessionSigs = await getSessionSigs({
          chain,
          expiration,
          // @ts-ignore - ignoring type error as instructed
          resourceAbilityRequests: resourceAbilities,
          // @ts-ignore - ignoring type error as instructed
          authSig: authMethod,  // Renamed to match expected prop
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
