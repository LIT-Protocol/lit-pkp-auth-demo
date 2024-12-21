import {
  GoogleProvider,
  DiscordProvider,
  EthWalletProvider,
  WebAuthnProvider,
  StytchOTPProvider,
  LitAuthClient,
} from '@lit-protocol/lit-auth-client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {
  AuthCallbackParams,
  AuthMethod,
  GetSessionSigsProps,
  IRelayPKP,
  SessionSigs,
  ProviderType,
} from '@lit-protocol/types';
import { LitPKPResource } from '@lit-protocol/auth-helpers';

export interface LitConfig {
  relayUrl?: string;
  network?: string;
  debug?: boolean;
  stytchProjectId?: string;
}

const defaultConfig: LitConfig = {
  relayUrl: 'https://relay-server-dev.herokuapp.com',
  network: 'cayenne',
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

  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  await googleProvider.signIn();
  const authMethod = await googleProvider.authenticate();
  return authMethod;
}

/**
 * Get auth method object for Discord OAuth
 */
export async function authenticateWithDiscord(redirectUri: string): Promise<AuthMethod> {
  if (!currentConfig) {
    throw new Error('Lit client not initialized. Call initLitClient first.');
  }

  const discordProvider = litAuthClient.initProvider<DiscordProvider>(
    ProviderType.Discord,
    { redirectUri }
  );
  await discordProvider.signIn();
  const authMethod = await discordProvider.authenticate();
  return authMethod;
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

  const ethWalletProvider = litAuthClient.initProvider<EthWalletProvider>(
    ProviderType.EthWallet
  );
  const authMethod = await ethWalletProvider.authenticate({
    address,
    signMessage,
  });
  return authMethod;
}

/**
 * Get auth method object for WebAuthn
 */
export async function authenticateWithWebAuthn(): Promise<AuthMethod> {
  if (!currentConfig) {
    throw new Error('Lit client not initialized. Call initLitClient first.');
  }

  const webAuthnProvider = litAuthClient.initProvider<WebAuthnProvider>(
    ProviderType.WebAuthn
  );
  const options = await webAuthnProvider.register();
  const authMethod = await webAuthnProvider.authenticate(options);
  return authMethod;
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
  
  const stytchProvider = litAuthClient.initProvider<StytchOTPProvider>(
    ProviderType.StytchOtp,
    {
      appId: currentConfig.stytchProjectId || '',
    }
  );
  const authMethod = await stytchProvider.authenticate({
    accessToken,
    userId,
    method,
  });
  return authMethod;
}

/**
 * Mint a new PKP for the given auth method
 */
export async function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP> {
  try {
    const mintRes = await litAuthClient.mintPKP(authMethod);
    if (!mintRes?.pkp) {
      throw new Error('Failed to mint PKP');
    }

    return mintRes.pkp;
  } catch (err) {
    throw new Error('Error minting PKP');
  }
}

/**
 * Get PKPs associated with given auth method
 */
export async function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]> {
  try {
    const pkps = await litAuthClient.fetchPKPsThroughRelayer(authMethod);
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
