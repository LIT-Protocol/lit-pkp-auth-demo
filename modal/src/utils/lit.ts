import {
  DiscordProvider,
  GoogleProvider,
  EthWalletProvider,
  WebAuthnProvider,
  BaseProvider,
  LitRelay,
  StytchAuthFactorOtpProvider,
} from '@lit-protocol/lit-auth-client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {
  AuthMethodScope,
  AuthMethodType,
  LIT_ABILITY,
  LIT_NETWORK,
  LIT_NETWORK_VALUES,
} from '@lit-protocol/constants';
import {
  AuthMethod,
  GetSessionSigsProps,
  IRelayPKP,
  SessionSigs,
  LIT_NETWORKS_KEYS,
} from '@lit-protocol/types';
import { LitPKPResource } from '@lit-protocol/auth-helpers';

export interface LitConfig {
  network?: LIT_NETWORKS_KEYS;
  debug?: boolean;
  domain?: string;
  redirectUri?: string;
  stytchProjectId?: string;
}

const defaultConfig: LitConfig = {
  network: LIT_NETWORK.DatilDev,
  debug: false,
  domain: 'localhost',
};

let config = { ...defaultConfig };

export function initLit(userConfig: LitConfig = {}) {
  config = { ...defaultConfig, ...userConfig };
}

export const litNodeClient: LitNodeClient = new LitNodeClient({
  alertWhenUnauthorized: false,
  litNetwork: config.network ? (config.network as LIT_NETWORK_VALUES) : ('serrano' as LIT_NETWORK_VALUES),
  debug: config.debug,
});

litNodeClient.connect();

const litRelay = new LitRelay({
  relayUrl: LitRelay.getRelayUrl((config.network || 'serrano') as LIT_NETWORK_VALUES),
  relayApiKey: 'test-api-key',
});

/**
 * Setting all available providers
 */
let googleProvider: GoogleProvider;
let discordProvider: DiscordProvider;
let ethWalletProvider: EthWalletProvider;
let webAuthnProvider: WebAuthnProvider;
let stytchEmailOtpProvider: StytchAuthFactorOtpProvider<'email'>;
let stytchSmsOtpProvider: StytchAuthFactorOtpProvider<'sms'>;

/**
 * Get the provider that is authenticated with the given auth method
 */
function getAuthenticatedProvider(authMethod: AuthMethod): BaseProvider {
  const providers = {
    [AuthMethodType.GoogleJwt]: googleProvider,
    [AuthMethodType.Discord]: discordProvider,
    [AuthMethodType.EthWallet]: ethWalletProvider,
    [AuthMethodType.WebAuthn]: webAuthnProvider,
    [AuthMethodType.StytchEmailFactorOtp]: stytchEmailOtpProvider,
    [AuthMethodType.StytchSmsFactorOtp]: stytchSmsOtpProvider,
  };

  return providers[authMethod.authMethodType as keyof typeof providers];
}

function getGoogleProvider(redirectUri: string) {
  if (!googleProvider) {
    googleProvider = new GoogleProvider({
      relay: litRelay,
      litNodeClient,
      redirectUri,
    });
  }
  return googleProvider;
}

function getDiscordProvider(redirectUri: string) {
  if (!discordProvider) {
    discordProvider = new DiscordProvider({
      relay: litRelay,
      litNodeClient,
      redirectUri,
    });
  }
  return discordProvider;
}

function getEthWalletProvider() {
  if (!ethWalletProvider) {
    ethWalletProvider = new EthWalletProvider({
      relay: litRelay,
      litNodeClient,
      domain: config.domain,
      origin: `http://${config.domain}`,
    });
  }
  return ethWalletProvider;
}

function getWebAuthnProvider() {
  if (!webAuthnProvider) {
    webAuthnProvider = new WebAuthnProvider({
      relay: litRelay,
      litNodeClient,
    });
  }
  return webAuthnProvider;
}

function getStytchEmailOtpProvider() {
  if (!stytchEmailOtpProvider) {
    stytchEmailOtpProvider = new StytchAuthFactorOtpProvider<'email'>(
      {
        relay: litRelay,
        litNodeClient,
      },
      { appId: config.stytchProjectId || '' },
      'email',
    );
  }
  return stytchEmailOtpProvider;
}

function getStytchSmsOtpProvider() {
  if (!stytchSmsOtpProvider) {
    stytchSmsOtpProvider = new StytchAuthFactorOtpProvider<'sms'>(
      {
        relay: litRelay,
        litNodeClient,
      },
      { appId: config.stytchProjectId || '' },
      'sms',
    );
  }
  return stytchSmsOtpProvider;
}

/**
 * Validate provider
 */
export function isSocialLoginSupported(provider: string): boolean {
  return ['google', 'discord'].includes(provider);
}

/**
 * Redirect to Lit login
 */
export async function signInWithGoogle(redirectUri: string): Promise<void> {
  const googleProvider = getGoogleProvider(redirectUri);
  await googleProvider.signIn();
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithGoogle(
  redirectUri: string
): Promise<AuthMethod> {
  const googleProvider = getGoogleProvider(redirectUri);
  const authMethod = await googleProvider.authenticate();
  return authMethod;
}

/**
 * Redirect to Lit login
 */
export async function signInWithDiscord(redirectUri: string): Promise<void> {
  const discordProvider = getDiscordProvider(redirectUri);
  await discordProvider.signIn();
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithDiscord(
  redirectUri: string
): Promise<AuthMethod> {
  const discordProvider = getDiscordProvider(redirectUri);
  const authMethod = await discordProvider.authenticate();
  return authMethod;
}

/**
 * Get auth method object by signing a message with an Ethereum wallet
 */
export async function authenticateWithEthWallet(
  address?: string,
  signMessage?: (message: string) => Promise<string>
): Promise<AuthMethod> {
  const ethWalletProvider = getEthWalletProvider();
  return await ethWalletProvider.authenticate({
    address,
    signMessage,
  });
}

/**
 * Register new WebAuthn credential
 */
export async function registerWebAuthn(): Promise<IRelayPKP> {
  const webAuthnProvider = getWebAuthnProvider();
  // Register new WebAuthn credential
  const options = await webAuthnProvider.register();

  // Verify registration and mint PKP through relay server
  const txHash = await webAuthnProvider.verifyAndMintPKPThroughRelayer(options);
  const response = await webAuthnProvider.relay.pollRequestUntilTerminalState(txHash);
  if (response.status !== 'Succeeded') {
    throw new Error('Minting failed');
  }
  const newPKP: IRelayPKP = {
    tokenId: response.pkpTokenId || '',
    publicKey: response.pkpPublicKey || '',
    ethAddress: response.pkpEthAddress || '',
  };
  return newPKP;
}

/**
 * Get auth method object by authenticating with a WebAuthn credential
 */
export async function authenticateWithWebAuthn(): Promise<AuthMethod> {
  const webAuthnProvider = getWebAuthnProvider();
  return await webAuthnProvider.authenticate();
}

/**
 * Get auth method object by validating Stytch JWT
 */
export async function authenticateWithStytch(
  accessToken: string,
  userId?: string,
  method?: string
): Promise<AuthMethod> {
  const provider = method === 'email' ? getStytchEmailOtpProvider() : getStytchSmsOtpProvider();
  return await provider?.authenticate({ accessToken, userId });
}

/**
 * Generate session sigs for given params
 */
export async function getSessionSigs({
  pkpPublicKey,
  authMethod,
  sessionSigsParams,
}: {
  pkpPublicKey: string;
  authMethod: AuthMethod;
  sessionSigsParams: GetSessionSigsProps;
}): Promise<SessionSigs> {
  await litNodeClient.connect();
  const sessionSigs = await litNodeClient.getPkpSessionSigs({
    ...sessionSigsParams,
    pkpPublicKey,
    authMethods: [authMethod],
    resourceAbilityRequests: [
      {
        resource: new LitPKPResource('*'),
        ability: LIT_ABILITY.PKPSigning,
      },
    ],
  });

  return sessionSigs;
}

/**
 * Fetch PKPs associated with given auth method
 */
export async function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]> {
  const provider = getAuthenticatedProvider(authMethod);
  const allPKPs = await provider.fetchPKPsThroughRelayer(authMethod);
  return allPKPs;
}

/**
 * Mint a new PKP for current auth method
 */
export async function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP> {
  const provider = getAuthenticatedProvider(authMethod);
  // Set scope of signing any data
  const options = {
    permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]],
  };

  let txHash: string;

  if (authMethod.authMethodType === AuthMethodType.WebAuthn) {
    // WebAuthn provider requires different steps
    const webAuthnProvider = provider as WebAuthnProvider;
    // Register new WebAuthn credential
    const webAuthnInfo = await webAuthnProvider.register();

    // Verify registration and mint PKP through relay server
    txHash = await webAuthnProvider.verifyAndMintPKPThroughRelayer(
      webAuthnInfo,
      options
    );
  } else {
    txHash = await provider.mintPKPThroughRelayer(authMethod, options);
  }

  const response = await provider.relay.pollRequestUntilTerminalState(txHash);
  if (response.status !== 'Succeeded') {
    throw new Error('Minting failed');
  }

  const newPKP: IRelayPKP = {
    tokenId: response.pkpTokenId || '',
    publicKey: response.pkpPublicKey || '',
    ethAddress: response.pkpEthAddress || '',
  };

  return newPKP;
}