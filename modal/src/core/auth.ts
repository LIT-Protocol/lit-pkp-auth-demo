import {
  AuthMethod,
  GetSessionSigsProps,
  IRelayPKP,
  SessionSigs,
  LIT_NETWORKS_KEYS,
} from '@lit-protocol/types';
import {
  AuthMethodScope,
  AuthMethodType,
  LIT_ABILITY,
} from '@lit-protocol/constants';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitPKPResource } from '@lit-protocol/auth-helpers';
import {
  DiscordProvider,
  GoogleProvider,
  EthWalletProvider,
  WebAuthnProvider,
  BaseProvider,
  LitRelay,
  StytchAuthFactorOtpProvider,
} from '@lit-protocol/lit-auth-client';

// Core authentication class
export class LitAuthClient {
  private litNodeClient: LitNodeClient;
  private litRelay: LitRelay;
  private providers: {
    google?: GoogleProvider;
    discord?: DiscordProvider;
    ethereum?: EthWalletProvider;
    webauthn?: WebAuthnProvider;
    stytchEmail?: StytchAuthFactorOtpProvider<'email'>;
    stytchSms?: StytchAuthFactorOtpProvider<'sms'>;
  };

  constructor(config: {
    litNetwork: LIT_NETWORKS_KEYS;
    debug?: boolean;
    domain?: string;
    origin?: string;
    redirectUri?: string;
    stytchProjectId?: string;
  }) {
    this.litNodeClient = new LitNodeClient({
      alertWhenUnauthorized: false,
      litNetwork: config.litNetwork,
      debug: config.debug,
    });

    this.litRelay = new LitRelay({
      relayUrl: LitRelay.getRelayUrl(config.litNetwork),
      relayApiKey: 'test-api-key',
    });

    this.providers = {};

    // Initialize providers
    if (config.redirectUri) {
      this.providers.google = new GoogleProvider({
        relay: this.litRelay,
        litNodeClient: this.litNodeClient,
        redirectUri: config.redirectUri,
      });

      this.providers.discord = new DiscordProvider({
        relay: this.litRelay,
        litNodeClient: this.litNodeClient,
        redirectUri: config.redirectUri,
      });
    }

    this.providers.ethereum = new EthWalletProvider({
      relay: this.litRelay,
      litNodeClient: this.litNodeClient,
      domain: config.domain || 'localhost',
      origin: config.origin || 'http://localhost:3000',
    });

    this.providers.webauthn = new WebAuthnProvider({
      relay: this.litRelay,
      litNodeClient: this.litNodeClient,
    });

    if (config.stytchProjectId) {
      this.providers.stytchEmail = new StytchAuthFactorOtpProvider(
        {
          relay: this.litRelay,
          litNodeClient: this.litNodeClient,
        },
        { appId: config.stytchProjectId },
        'email'
      );

      this.providers.stytchSms = new StytchAuthFactorOtpProvider(
        {
          relay: this.litRelay,
          litNodeClient: this.litNodeClient,
        },
        { appId: config.stytchProjectId },
        'sms'
      );
    }
  }

  async connect() {
    await this.litNodeClient.connect();
  }

  private getProvider(authMethod: AuthMethod): BaseProvider {
    const providerMap = {
      [AuthMethodType.GoogleJwt]: this.providers.google,
      [AuthMethodType.Discord]: this.providers.discord,
      [AuthMethodType.EthWallet]: this.providers.ethereum,
      [AuthMethodType.WebAuthn]: this.providers.webauthn,
      [AuthMethodType.StytchEmailFactorOtp]: this.providers.stytchEmail,
      [AuthMethodType.StytchSmsFactorOtp]: this.providers.stytchSms,
    } as const;

    type ProviderType = typeof providerMap[keyof typeof providerMap];
    const providers = providerMap as Record<AuthMethod['authMethodType'], ProviderType>;

    const provider = providers[authMethod.authMethodType];
    if (!provider) {
      throw new Error(`Provider not found for auth method: ${authMethod.authMethodType}`);
    }

    return provider;
  }

  async authenticateWithGoogle(): Promise<AuthMethod> {
    if (!this.providers.google) {
      throw new Error('Google provider not initialized');
    }
    return await this.providers.google.authenticate();
  }

  async authenticateWithDiscord(): Promise<AuthMethod> {
    if (!this.providers.discord) {
      throw new Error('Discord provider not initialized');
    }
    return await this.providers.discord.authenticate();
  }

  async authenticateWithEthWallet(
    address?: string,
    signMessage?: (message: string) => Promise<string>
  ): Promise<AuthMethod> {
    if (!this.providers.ethereum) {
      throw new Error('Ethereum provider not initialized');
    }
    return await this.providers.ethereum.authenticate({ address, signMessage });
  }

  async authenticateWithWebAuthn(): Promise<AuthMethod> {
    if (!this.providers.webauthn) {
      throw new Error('WebAuthn provider not initialized');
    }
    return await this.providers.webauthn.authenticate();
  }

  async authenticateWithStytch(
    accessToken: string,
    userId?: string,
    method?: 'email' | 'sms'
  ): Promise<AuthMethod> {
    const provider = method === 'email' ? this.providers.stytchEmail : this.providers.stytchSms;
    if (!provider) {
      throw new Error(`Stytch ${method} provider not initialized`);
    }
    return await provider.authenticate({ accessToken, userId });
  }

  async getSessionSigs({
    pkpPublicKey,
    authMethod,
    sessionSigsParams,
  }: {
    pkpPublicKey: string;
    authMethod: AuthMethod;
    sessionSigsParams: GetSessionSigsProps;
  }): Promise<SessionSigs> {
    await this.connect();
    return await this.litNodeClient.getPkpSessionSigs({
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
  }

  async getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]> {
    const provider = this.getProvider(authMethod);
    return await provider.fetchPKPsThroughRelayer(authMethod);
  }

  async mintPKP(authMethod: AuthMethod): Promise<IRelayPKP> {
    const provider = this.getProvider(authMethod);
    const options = {
      permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]],
    };

    if (authMethod.authMethodType === AuthMethodType.WebAuthn) {
      const webAuthnProvider = provider as WebAuthnProvider;
      const webAuthnInfo = await webAuthnProvider.register();
      const txHash = await webAuthnProvider.verifyAndMintPKPThroughRelayer(webAuthnInfo);
      const response = await webAuthnProvider.relay.pollRequestUntilTerminalState(txHash);
      if (response.status !== 'Succeeded') {
        throw new Error('Minting failed');
      }
      if (!response.pkpTokenId || !response.pkpPublicKey || !response.pkpEthAddress) {
        throw new Error('Missing PKP data in response');
      }
      return {
        tokenId: response.pkpTokenId,
        publicKey: response.pkpPublicKey,
        ethAddress: response.pkpEthAddress,
      };
    }

    const txHash = await provider.mintPKPThroughRelayer(authMethod, options);
    const response = await provider.relay.pollRequestUntilTerminalState(txHash);
    if (response.status !== 'Succeeded') {
      throw new Error('Minting failed');
    }
    if (!response.pkpTokenId || !response.pkpPublicKey || !response.pkpEthAddress) {
      throw new Error('Missing PKP data in response');
    }
    return {
      tokenId: response.pkpTokenId,
      publicKey: response.pkpPublicKey,
      ethAddress: response.pkpEthAddress,
    };
  }
}
