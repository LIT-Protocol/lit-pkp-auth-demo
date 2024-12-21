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
exports.useLitAuth = useLitAuth;
const react_1 = require("react");
const lit_auth_client_1 = require("@lit-protocol/lit-auth-client");
const lit_1 = require("../utils/lit");
function useLitAuth({ redirectUri, onConnect } = {}) {
    const [authMethod, setAuthMethod] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    const authWithGoogle = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        setError(undefined);
        setAuthMethod(undefined);
        try {
            const result = yield (0, lit_1.authenticateWithGoogle)(redirectUri);
            setAuthMethod(result);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }), [redirectUri]);
    const authWithDiscord = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        setError(undefined);
        setAuthMethod(undefined);
        try {
            const result = yield (0, lit_1.authenticateWithDiscord)(redirectUri);
            setAuthMethod(result);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }), [redirectUri]);
    const authWithEthWallet = (0, react_1.useCallback)((connector) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        setError(undefined);
        setAuthMethod(undefined);
        try {
            if (!onConnect) {
                throw new Error('onConnect callback is required for wallet authentication');
            }
            const { account, connector: activeConnector } = yield onConnect(connector);
            const signer = yield activeConnector.getSigner();
            const signMessage = (message) => __awaiter(this, void 0, void 0, function* () {
                const sig = yield signer.signMessage(message);
                return sig;
            });
            const result = yield (0, lit_1.authenticateWithEthWallet)(account, signMessage);
            setAuthMethod(result);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }), [onConnect]);
    const authWithWebAuthn = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        setError(undefined);
        setAuthMethod(undefined);
        try {
            const result = yield (0, lit_1.authenticateWithWebAuthn)();
            setAuthMethod(result);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }), []);
    const authWithStytch = (0, react_1.useCallback)((accessToken, userId, method) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        setError(undefined);
        setAuthMethod(undefined);
        try {
            const result = yield (0, lit_1.authenticateWithStytch)(accessToken, userId, method);
            setAuthMethod(result);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }), []);
    (0, react_1.useEffect)(() => {
        const handleRedirect = () => __awaiter(this, void 0, void 0, function* () {
            if (!redirectUri)
                return;
            try {
                if ((0, lit_auth_client_1.isSignInRedirect)(redirectUri)) {
                    const provider = (0, lit_auth_client_1.getProviderFromUrl)();
                    if (provider === 'google') {
                        yield authWithGoogle();
                    }
                    else if (provider === 'discord') {
                        yield authWithDiscord();
                    }
                }
            }
            catch (err) {
                setError(err);
            }
        });
        handleRedirect();
    }, [redirectUri, authWithGoogle, authWithDiscord]);
    return {
        authWithGoogle,
        authWithDiscord,
        authWithEthWallet,
        authWithWebAuthn,
        authWithStytch,
        authMethod,
        loading,
        error,
    };
}
//# sourceMappingURL=useLitAuth.js.map