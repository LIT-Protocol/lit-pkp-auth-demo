import {
  GoogleProvider,
  DiscordProvider,
  EthWalletProvider,
  WebAuthnProvider,
  StytchOtpProvider,
} from '@lit-protocol/lit-auth-client';
import { LitAuthClient } from '@lit-protocol/lit-auth-client/src/lib/lit-auth-client';
import { AuthMethodType, LIT_NETWORKS, ProviderType } from '@lit-protocol/constants';
import { BaseProvider } from '@lit-protocol/lit-auth-client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {
  AuthMethod,
  GetSessionSigsProps,
  IRelayPKP,
  SessionSigs,
} from '@lit-protocol/types';

export interface LitConfig {
  relayUrl?: string;
  network?: keyof typeof LIT_NETWORKS;
  debug?: boolean;
  stytchProjectId?: string;
}

const defaultConfig: LitConfig = {
  relayUrl: 'https://relay-server-dev.herokuapp.com',
  network: 'datil',
  debug: false
};

let litAuthClient: LitAuthClient;
let litNodeClient: LitNodeClient;
let currentConfig: LitConfig;

export function initLitClient(config: LitConfig = defaultConfig) {
  currentConfig = {
    ...defaultConfig,
    ...config
  };
  // Initialize auth client
  litAuthClient = new LitAuthClient({
    litRelayConfig: {
      relayUrl: config.relayUrl || defaultConfig.relayUrl,
    },
  });

  // Initialize node client
  litNodeClient = new LitNodeClient({
    litNetwork: config.network || defaultConfig.network,
    debug: config.debug || defaultConfig.debug,
  });

  // Connect to Lit nodes
  litNodeClient.connect();
}

/**
 * Get auth method object for Google OAuth
 */
export async function authenticateWithGoogle(redirectUri: string): Promise<AuthMethod> {
  if (!currentConfig) {
    throw new Error('Lit client not initialized. Call initLitClient first.');
  }

  // @ts-ignore - ignoring type error as instructed
  const googleProvider = litAuthClient.initProvider('google', { redirectUri });
  // @ts-ignore - ignoring type error as instructed
  const authMethod = await googleProvider.authenticate();
  return {
    authMethodType: AuthMethodType.Google,
    accessToken: authMethod.accessToken
  };
}

/**
 * Get auth method object for Discord OAuth
 */
export async function authenticateWithDiscord(redirectUri: string): Promise<AuthMethod> {
  if (!currentConfig) {
    throw new Error('Lit client not initialized. Call initLitClient first.');
  }

  // @ts-ignore - ignoring type error as instructed
  const discordProvider = litAuthClient.initProvider('discord', { redirectUri });
  // @ts-ignore - ignoring type error as instructed
  const authMethod = await discordProvider.authenticate();
  return {
    authMethodType: AuthMethodType.Discord,
    accessToken: authMethod.accessToken
  };
}

/**
 * Get auth method object for Ethereum wallet
 */
export async function authenticateWithEthWallet(
  address: string,
  signMessage: (message: string) => Promise<string>
): Promise<AuthMethod> {
  if (!currentConfig) {
    throw new Error('Lit client not initialized. Call initLitClient first.');
  }

  // @ts-ignore - ignoring type error as instructed
  const ethWalletProvider = litAuthClient.initProvider('ethwallet');
  // @ts-ignore - ignoring type error as instructed
  const authMethod = await ethWalletProvider.authenticate({
    address,
    signMessage,
  });
  return {
    authMethodType: AuthMethodType.EthWallet,
    accessToken: authMethod.accessToken
  };
}

/**
 * Get auth method object for WebAuthn
 */
export async function authenticateWithWebAuthn(): Promise<AuthMethod> {
  if (!currentConfig) {
    throw new Error('Lit client not initialized. Call initLitClient first.');
  }

  // @ts-ignore - ignoring type error as instructed
  const webAuthnProvider = litAuthClient.initProvider('webauthn');
  // @ts-ignore - ignoring type error as instructed
  const credential = await webAuthnProvider.authenticate();
  return {
    authMethodType: AuthMethodType.WebAuthn,
    accessToken: credential.accessToken
  };
}

/**
 * Get auth method object for Stytch OTP
 */
export async function authenticateWithStytch(
  accessToken: string,
  userId?: string,
  method?: string
): Promise<AuthMethod> {
  if (!currentConfig) {
    throw new Error('Lit client not initialized. Call initLitClient first.');
  }
  
  // @ts-ignore - ignoring type error as instructed
  const stytchProvider = litAuthClient.initProvider('stytchOtp', {
    appId: currentConfig.stytchProjectId || '',
  });
  const authMethod = await stytchProvider.authenticate({
    accessToken,
    userId,
    method,
  });
  return {
    authMethodType: AuthMethodType.StytchOtp,
    accessToken: authMethod.accessToken
  };
}

/**
 * Mint a new PKP for the given auth method
 */
export async function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP> {
  try {
    const mintRes = await litAuthClient.mintPKPWithAuthMethods([authMethod], {
      pkpPermissionScopes: [[1]], // Sign anything permission
      addPkpEthAddressAsPermittedAddress: true,
      sendPkpToitself: false
    });
    if (!mintRes?.pkpPublicKey) {
      throw new Error('Failed to mint PKP');
    }

    return {
      publicKey: mintRes.pkpPublicKey,
      ethAddress: mintRes.pkpEthAddress,
      tokenId: mintRes.pkpTokenId
    };
  } catch (err) {
    throw new Error('Error minting PKP');
  }
}

/**
 * Get PKPs associated with given auth method
 */
export async function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]> {
  try {
    // @ts-ignore - ignoring type error as instructed
    const provider = litAuthClient.getProvider(authMethod.authMethodType);
    if (!provider) {
      throw new Error('Provider not found');
    }
    const pkps = await provider.fetchPKPsThroughRelayer(authMethod);
    return pkps;
  } catch (err) {
    throw new Error('Error fetching PKPs');
  }
}

/**
 * Get session signatures for given PKP
 */
export async function getSessionSigs(props: GetSessionSigsProps): Promise<SessionSigs> {
  try {
    const sessionSigs = await litNodeClient.getSessionSigs(props);
    return sessionSigs;
  } catch (err) {
    throw new Error('Error getting session signatures');
  }
}
