import { AuthSig } from '@lit-protocol/auth-helpers';
import { LIT_NETWORK } from '@lit-protocol/constants';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LIT_NETWORKS_KEYS } from '@lit-protocol/types';
import { Wallet } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';

const litNetwork = ((process.env
    .NEXT_PUBLIC_LIT_NETWORK as string) ||
  LIT_NETWORK.DatilDev) as LIT_NETWORKS_KEYS;

interface SuccessfulResponseData {
  capacityDelegationAuthSig: AuthSig;
}

interface ErrorResponseData {
  error: string;
}

type ResponseData = SuccessfulResponseData | ErrorResponseData;

export const litNodeClient: LitNodeClient = new LitNodeClient({
  litNetwork,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { address } = req.query

    if (['datil-test', 'habanero', 'manzano'].includes(litNetwork)) {
      const addresses = Array.isArray(address) ? address : [address]

      const RLIWallet = new Wallet(process.env.RLI_WALLET_PRIVATE_KEY as string);
      const { capacityDelegationAuthSig} = await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: RLIWallet,
        delegateeAddresses: addresses,
      });
      res.status(200).json({ capacityDelegationAuthSig });
    }

    res.status(200).end();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
