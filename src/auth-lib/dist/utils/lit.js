"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLitClient = initLitClient;
exports.authenticateWithGoogle = authenticateWithGoogle;
exports.authenticateWithDiscord = authenticateWithDiscord;
exports.authenticateWithEthWallet = authenticateWithEthWallet;
exports.authenticateWithWebAuthn = authenticateWithWebAuthn;
exports.authenticateWithStytch = authenticateWithStytch;
exports.mintPKP = mintPKP;
exports.getPKPs = getPKPs;
exports.getSessionSigs = getSessionSigs;
const lit_auth_client_1 = require("@lit-protocol/lit-auth-client/src/lib/lit-auth-client");
const constants_1 = require("@lit-protocol/constants");
const lit_node_client_1 = require("@lit-protocol/lit-node-client");
const defaultConfig = {
    relayUrl: 'https://relay-server-dev.herokuapp.com',
    network: 'datil',
    debug: false
};
let litAuthClient;
let litNodeClient;
let currentConfig;
function initLitClient(config = defaultConfig) {
    currentConfig = Object.assign(Object.assign({}, defaultConfig), config);
    litAuthClient = new lit_auth_client_1.LitAuthClient({
        litRelayConfig: {
            relayUrl: config.relayUrl || defaultConfig.relayUrl,
        },
    });
    litNodeClient = new lit_node_client_1.LitNodeClient({
        litNetwork: config.network || defaultConfig.network,
        debug: config.debug || defaultConfig.debug,
    });
    litNodeClient.connect();
}
function authenticateWithGoogle(redirectUri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentConfig) {
            throw new Error('Lit client not initialized. Call initLitClient first.');
        }
        const googleProvider = litAuthClient.initProvider('google', { redirectUri });
        const authMethod = yield googleProvider.authenticate();
        return {
            authMethodType: constants_1.AuthMethodType.Google,
            accessToken: authMethod.accessToken
        };
    });
}
function authenticateWithDiscord(redirectUri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentConfig) {
            throw new Error('Lit client not initialized. Call initLitClient first.');
        }
        const discordProvider = litAuthClient.initProvider('discord', { redirectUri });
        const authMethod = yield discordProvider.authenticate();
        return {
            authMethodType: constants_1.AuthMethodType.Discord,
            accessToken: authMethod.accessToken
        };
    });
}
function authenticateWithEthWallet(address, signMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentConfig) {
            throw new Error('Lit client not initialized. Call initLitClient first.');
        }
        const ethWalletProvider = litAuthClient.initProvider('ethwallet');
        const authMethod = yield ethWalletProvider.authenticate({
            address,
            signMessage,
        });
        return {
            authMethodType: constants_1.AuthMethodType.EthWallet,
            accessToken: authMethod.accessToken
        };
    });
}
function authenticateWithWebAuthn() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentConfig) {
            throw new Error('Lit client not initialized. Call initLitClient first.');
        }
        const webAuthnProvider = litAuthClient.initProvider('webauthn');
        const credential = yield webAuthnProvider.authenticate();
        return {
            authMethodType: constants_1.AuthMethodType.WebAuthn,
            accessToken: credential.accessToken
        };
    });
}
function authenticateWithStytch(accessToken, userId, method) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentConfig) {
            throw new Error('Lit client not initialized. Call initLitClient first.');
        }
        const stytchProvider = litAuthClient.initProvider('stytchOtp', {
            appId: currentConfig.stytchProjectId || '',
        });
        const authMethod = yield stytchProvider.authenticate({
            accessToken,
            userId,
            method,
        });
        return {
            authMethodType: constants_1.AuthMethodType.StytchOtp,
            accessToken: authMethod.accessToken
        };
    });
}
function mintPKP(authMethod) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mintRes = yield litAuthClient.mintPKPWithAuthMethods([authMethod], {
                pkpPermissionScopes: [[1]],
                addPkpEthAddressAsPermittedAddress: true,
                sendPkpToitself: false
            });
            if (!(mintRes === null || mintRes === void 0 ? void 0 : mintRes.pkpPublicKey)) {
                throw new Error('Failed to mint PKP');
            }
            return {
                publicKey: mintRes.pkpPublicKey,
                ethAddress: mintRes.pkpEthAddress,
                tokenId: mintRes.pkpTokenId
            };
        }
        catch (err) {
            throw new Error('Error minting PKP');
        }
    });
}
function getPKPs(authMethod) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const provider = litAuthClient.getProvider(authMethod.authMethodType);
            if (!provider) {
                throw new Error('Provider not found');
            }
            const pkps = yield provider.fetchPKPsThroughRelayer(authMethod);
            return pkps;
        }
        catch (err) {
            throw new Error('Error fetching PKPs');
        }
    });
}
function getSessionSigs(props) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sessionSigs = yield litNodeClient.getSessionSigs(props);
            return sessionSigs;
        }
        catch (err) {
            throw new Error('Error getting session signatures');
        }
    });
}
//# sourceMappingURL=lit.js.map