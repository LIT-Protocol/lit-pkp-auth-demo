import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { getSessionSigs } from '../utils/lit';
import { AuthSig, LitAbility, LitActionResource } from '@lit-protocol/auth-helpers';
import { IRelayPKP } from '@lit-protocol/types';
import { SessionSigs } from '@lit-protocol/types';
import { LitAuthClient } from '@lit-protocol/lit-auth-client';

export default function useSession() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  /**
  * This function loads the capacityDelegationAuthSig from an environment variable.
  * For production use, it is recommended to replace this static implementation
  * with a call to a secure backend API that provides the signature.
  */
  const generateCapacityDelegationAuthSig = (): AuthSig => {
    const delegationAuthSig = process.env.NEXT_PUBLIC_CAPACITY_DELEGATION_AUTH_SIG;
    if (!delegationAuthSig) {
        throw new Error('CAPACITY_DELEGATION_AUTH_SIG environment variable is not set');
    }
    return JSON.parse(delegationAuthSig);
  };

  /**
   * Generate session sigs and store new session data
   */
  const initSession = useCallback(
    async (litAuthClient: LitAuthClient, authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
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
          Date.now() + 1000 * 60 * 60 * 24 * 7
        ).toISOString(); // 1 week

        // Get capacityDelegationAuthSig generated from a wallet with the Capacity Credit NFT to pay for the session
        const capacityDelegationAuthSig = generateCapacityDelegationAuthSig();

        // Generate session sigs
        const sessionSigs = await getSessionSigs({
          litAuthClient,
          pkpPublicKey: pkp.publicKey,
          authMethod,
          //@ts-ignore
          sessionSigsParams: {
            chain,
            expiration,
            resourceAbilityRequests: resourceAbilities,
            capacityDelegationAuthSig,
          },
        });

        setSessionSigs(sessionSigs);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    initSession,
    sessionSigs,
    loading,
    error,
  };
}
