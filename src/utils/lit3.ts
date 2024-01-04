import {
	DiscordProvider,
	GoogleProvider,
	EthWalletProvider,
	WebAuthnProvider,
	LitAuthClient,
} from '@lit-protocol/lit-auth-client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {
	AuthMethodScope,
	AuthMethodType,
	ProviderType,
} from '@lit-protocol/constants';
import {
	AuthMethod,
	GetSessionSigsProps,
	IRelayPKP,
	SessionSigs,
	AuthCallbackParams,
} from '@lit-protocol/types';

export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'localhost';
export const ORIGIN =
	process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
		? `https://${DOMAIN}`
		: `http://${DOMAIN}:3000`;

export const litNodeClient: LitNodeClient = new LitNodeClient({
	alertWhenUnauthorized: false,
	litNetwork: 'cayenne',
	debug: true,
});

export const litAuthClient: LitAuthClient = new LitAuthClient({
	litRelayConfig: {
		relayApiKey: 'test-api-key',
	},
	litNodeClient,
});

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
	const googleProvider = litAuthClient.initProvider<GoogleProvider>(
		ProviderType.Google,
		{ redirectUri }
	);
	await googleProvider.signIn();
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithGoogle(
	redirectUri: string
): Promise<AuthMethod | undefined> {
	const googleProvider = litAuthClient.initProvider<GoogleProvider>(
		ProviderType.Google,
		{ redirectUri }
	);
	const authMethod = await googleProvider.authenticate();
	return authMethod;
}

/**
 * Redirect to Lit login
 */
export async function signInWithDiscord(redirectUri: string): Promise<void> {
	const discordProvider = litAuthClient.initProvider<DiscordProvider>(
		ProviderType.Discord,
		{ redirectUri }
	);
	await discordProvider.signIn();
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithDiscord(
	redirectUri: string
): Promise<AuthMethod | undefined> {
	const discordProvider = litAuthClient.initProvider<DiscordProvider>(
		ProviderType.Discord,
		{ redirectUri }
	);
	const authMethod = await discordProvider.authenticate();
	return authMethod;
}

/**
 * Get auth method object by signing a message with an Ethereum wallet
 */
export async function authenticateWithEthWallet(
	address?: string,
	signMessage?: (message: string) => Promise<string>
): Promise<AuthMethod | undefined> {
	const ethWalletProvider = litAuthClient.initProvider<EthWalletProvider>(
		ProviderType.EthWallet,
		{
			domain: DOMAIN,
			origin: ORIGIN,
		}
	);
	const authMethod = await ethWalletProvider.authenticate({
		address,
		signMessage,
	});
	return authMethod;
}

/**
 * Register new WebAuthn credential
 */
export async function registerWebAuthn(): Promise<IRelayPKP> {
	const provider = litAuthClient.initProvider<WebAuthnProvider>(
		ProviderType.WebAuthn
	);
	// Register new WebAuthn credential
	const options = await provider.register();

	// Verify registration and mint PKP through relay server
	const txHash = await provider.verifyAndMintPKPThroughRelayer(options);
	const response = await provider.relay.pollRequestUntilTerminalState(txHash);
	if (response.status !== 'Succeeded') {
		throw new Error('Minting failed');
	}
	const newPKP: IRelayPKP = {
		tokenId: response.pkpTokenId,
		publicKey: response.pkpPublicKey,
		ethAddress: response.pkpEthAddress,
	};
	return newPKP;
}

/**
 * Get auth method object by authenticating with a WebAuthn credential
 */
export async function authenticateWithWebAuthn(): Promise<
	AuthMethod | undefined
> {
	let provider = litAuthClient.getProvider(ProviderType.WebAuthn);
	if (!provider) {
		provider = litAuthClient.initProvider<WebAuthnProvider>(
			ProviderType.WebAuthn
		);
	}
	const authMethod = await provider.authenticate();
	return authMethod;
}

/**
 * Get auth method object by validating Stytch JWT
 */
export async function authenticateWithStytch(
	accessToken: string,
	userId?: string
) {
	const provider = litAuthClient.initProvider(ProviderType.StytchOtp, {
		appId: process.env.NEXT_PUBLIC_STYTCH_PROJECT_ID,
	});
	// @ts-ignore
	const authMethod = await provider?.authenticate({ accessToken, userId });
	return authMethod;
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
	const provider = getProviderByAuthMethod(authMethod);
	if (provider) {
		const sessionSigs = await provider.getSessionSigs({
			pkpPublicKey,
			authMethod,
			sessionSigsParams,
		});
		return sessionSigs;
	} else {
		throw new Error(
			`Provider not found for auth method type ${authMethod.authMethodType}`
		);
	}
}

export async function updateSessionSigs(
	params: GetSessionSigsProps
): Promise<SessionSigs> {
	const sessionSigs = await litNodeClient.getSessionSigs(params);
	return sessionSigs;
}

/**
 * Fetch PKPs associated with given auth method
 */
export async function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]> {
	const provider = getProviderByAuthMethod(authMethod);
	const allPKPs = await provider.fetchPKPsThroughRelayer(authMethod);
	return allPKPs;
}

/**
 * Mint a new PKP for current auth method
 */
export async function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP> {
	const provider = getProviderByAuthMethod(authMethod);
	// Set scope of signing any data
	const options = {
		permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]],
	};

	let txHash: string;

	if (authMethod.authMethodType === AuthMethodType.WebAuthn) {
		// Register new WebAuthn credential
		const webAuthnInfo = await (provider as WebAuthnProvider).register();

		// Verify registration and mint PKP through relay server
		txHash = await (
			provider as WebAuthnProvider
		).verifyAndMintPKPThroughRelayer(webAuthnInfo, options);
	} else {
		// Mint PKP through relay server
		txHash = await provider.mintPKPThroughRelayer(authMethod, options);
	}

	const response = await provider.relay.pollRequestUntilTerminalState(txHash);
	if (response.status !== 'Succeeded') {
		throw new Error('Minting failed');
	}
	const newPKP: IRelayPKP = {
		tokenId: response.pkpTokenId,
		publicKey: response.pkpPublicKey,
		ethAddress: response.pkpEthAddress,
	};
	return newPKP;
}

/**
 * Get provider for given auth method
 */
function getProviderByAuthMethod(authMethod: AuthMethod) {
	switch (authMethod.authMethodType) {
		case AuthMethodType.GoogleJwt:
			return litAuthClient.getProvider(ProviderType.Google);
		case AuthMethodType.Discord:
			return litAuthClient.getProvider(ProviderType.Discord);
		case AuthMethodType.EthWallet:
			return litAuthClient.getProvider(ProviderType.EthWallet);
		case AuthMethodType.WebAuthn:
			return litAuthClient.getProvider(ProviderType.WebAuthn);
		case AuthMethodType.StytchOtp:
			return litAuthClient.getProvider(ProviderType.StytchOtp);
		default:
			return;
	}
}

async function authenticateUsingProvider(params) {
	switch (params.methodType) {
		case 'google':
			return await authenticateWithGoogle(params.redirectUri);
		case 'discord':
			return await authenticateWithDiscord(params.redirectUri);
		case 'ethWallet':
			return await authenticateWithEthWallet(params.address, params.signMessage);
		case 'webAuthn':
			return await authenticateWithWebAuthn();
		// Add other methods if necessary
		default:
			throw new Error(`Unknown authentication method: ${params.methodType}`);
	}
}

export async function authenticateWith2FA(firstMethodParams, secondMethodParams) {
	// First authentication
	const firstAuthMethod = await authenticateUsingProvider(firstMethodParams);
	if (!firstAuthMethod) {
		throw new Error('First authentication failed');
	}

	// Second authentication
	const secondAuthMethod = await authenticateUsingProvider(secondMethodParams);
	if (!secondAuthMethod) {
		throw new Error('Second authentication failed');
	}

	// Proceed with signature generation or any other process that requires both auth methods
	return { firstAuthMethod, secondAuthMethod };
}

export async function getSessionSigs2FA({
	pkpPublicKey,
	firstAuthMethod,
	secondAuthMethod,
	sessionSigsParams,
}: {
	pkpPublicKey: string;
	firstAuthMethod: AuthMethod;
	secondAuthMethod: AuthMethod;
	sessionSigsParams: GetSessionSigsProps;
}): Promise<SessionSigs[]> {
	const firstProvider = getProviderByAuthMethod(firstAuthMethod);
	const secondProvider = getProviderByAuthMethod(secondAuthMethod);
	if (!firstProvider || !secondProvider) {
		throw new Error('One or both providers not found for the provided auth methods');
	}

	const firstSessionSigs = await firstProvider.getSessionSigs({
		pkpPublicKey,
		authMethod: firstAuthMethod,
		sessionSigsParams,
	});

	const secondSessionSigs = await secondProvider.getSessionSigs({
		pkpPublicKey,
		authMethod: secondAuthMethod,
		sessionSigsParams,
	});

	return [firstSessionSigs, secondSessionSigs];
}