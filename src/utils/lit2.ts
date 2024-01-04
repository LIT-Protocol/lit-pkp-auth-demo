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
 * Generate session sigs for given params with two-factor authentication
 */
export async function getSessionSigs({
	pkpPublicKey,
	authMethods,
	sessionSigsParams,
}: {
	pkpPublicKey: string;
	authMethods: AuthMethod[];
	sessionSigsParams: GetSessionSigsProps;
}): Promise<SessionSigs> {
	const providers = authMethods.map((authMethod) =>
		getProviderByAuthMethod(authMethod)
	);

	const sessionSigs = await Promise.all(
		providers.map(async (provider, index) => {
			if (provider) {
				const authMethod = authMethods[index];
				return provider.getSessionSigs({
					pkpPublicKey,
					authMethod,
					sessionSigsParams,
				});
			} else {
				throw new Error(
					`Provider not found for auth method type ${authMethods[0].authMethodType}`
				);
			}
		})
	);

	// Combine or process sessionSigs as needed
	// For simplicity, assuming just one session signature is generated in this example
	return sessionSigs[0];
}

/**
 * Redirect to Lit login with Google and handle second authentication method
 */
export async function signInWithGoogle(
	redirectUri: string,
	secondAuthProvider: AuthMethod
): Promise<void> {
	const googleProvider = litAuthClient.initProvider<GoogleProvider>(
		ProviderType.Google,
		{ redirectUri }
	);
	await googleProvider.signIn();
	// Handle second authentication provider as needed
}

/**
 * Get auth method object from redirect with Google and handle second authentication method
 */
export async function authenticateWithGoogle(
	redirectUri: string,
	secondAuthProvider: AuthMethod
): Promise<AuthMethod | undefined> {
	const googleProvider = litAuthClient.initProvider<GoogleProvider>(
		ProviderType.Google,
		{ redirectUri }
	);
	const authMethod = await googleProvider.authenticate();
	// Handle second authentication provider as needed
	return authMethod;
}

/**
 * Redirect to Lit login with Discord and handle second authentication method
 */
export async function signInWithDiscord(
	redirectUri: string,
	secondAuthProvider: AuthMethod
): Promise<void> {
	const discordProvider = litAuthClient.initProvider<DiscordProvider>(
		ProviderType.Discord,
		{ redirectUri }
	);
	await discordProvider.signIn();
	// Handle second authentication provider as needed
}

/**
 * Get auth method object from redirect with Discord and handle second authentication method
 */
export async function authenticateWithDiscord(
	redirectUri: string,
	secondAuthProvider: AuthMethod
): Promise<AuthMethod | undefined> {
	const discordProvider = litAuthClient.initProvider<DiscordProvider>(
		ProviderType.Discord,
		{ redirectUri }
	);
	const authMethod = await discordProvider.authenticate();
	// Handle second authentication provider as needed
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
 * Get provider for given auth methods
 */
function getProviderByAuthMethods(authMethods: AuthMethod[]) {
	return authMethods.map((authMethod) =>
		getProviderByAuthMethod(authMethod)
	);
}

/**
 * Adapt the mintPKP function to handle multiple authentication methods
 */
export async function mintPKP(authMethods: AuthMethod[]): Promise<IRelayPKP> {
	const providers = authMethods.map((authMethod) =>
		getProviderByAuthMethod(authMethod)
	);

	// Set scope of signing any data
	const options = {
		permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]],
	};

	let txHash: string;

	const mintPromises = providers.map(async (provider, index) => {
		if (authMethods[index].authMethodType === AuthMethodType.WebAuthn) {
			// Handle WebAuthn separately if needed
			const webAuthnInfo = await (provider as WebAuthnProvider).register();
			txHash = await (
					provider as WebAuthnProvider
			).verifyAndMintPKPThroughRelayer(webAuthnInfo, options);
		} else {
			txHash = await provider.mintPKPThroughRelayer(
				authMethods[index],
				options
			);
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
	});

	const results = await Promise.all(mintPromises);

	// Combine or process results as needed
	// For simplicity, assuming just one PKP is minted in this example
	return results[0];
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
// export async function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP> {
//   const provider = getProviderByAuthMethod(authMethod);
//   // Set scope of signing any data
//   const options = {
//     permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]],
//   };

//   let txHash: string;

//   if (authMethod.authMethodType === AuthMethodType.WebAuthn) {
//     // Register new WebAuthn credential
//     const webAuthnInfo = await (provider as WebAuthnProvider).register();

//     // Verify registration and mint PKP through relay server
//     txHash = await (
//       provider as WebAuthnProvider
//     ).verifyAndMintPKPThroughRelayer(webAuthnInfo, options);
//   } else {
//     // Mint PKP through relay server
//     txHash = await provider.mintPKPThroughRelayer(authMethod, options);
//   }

//   const response = await provider.relay.pollRequestUntilTerminalState(txHash);
//   if (response.status !== 'Succeeded') {
//     throw new Error('Minting failed');
//   }

//   const newPKP: IRelayPKP = {
//     tokenId: response.pkpTokenId,
//     publicKey: response.pkpPublicKey,
//     ethAddress: response.pkpEthAddress,
//   };
//   return newPKP;
// }

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

