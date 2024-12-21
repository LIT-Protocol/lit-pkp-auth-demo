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
exports.default = useLitSession;
const react_1 = require("react");
const auth_helpers_1 = require("@lit-protocol/auth-helpers");
const lit_1 = require("../utils/lit");
function useLitSession({ sessionDuration = 1000 * 60 * 60 * 24 * 7 } = {}) {
    const [sessionSigs, setSessionSigs] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    const initSession = (0, react_1.useCallback)((authMethod, pkp) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        setError(undefined);
        try {
            const chain = 'ethereum';
            const resourceAbilities = [
                {
                    resource: new auth_helpers_1.LitActionResource('*'),
                    ability: auth_helpers_1.LitAbility.PKPSigning,
                },
            ];
            const expiration = new Date(Date.now() + sessionDuration).toISOString();
            const sessionSigs = yield (0, lit_1.getSessionSigs)({
                chain,
                expiration,
                resourceAbilityRequests: resourceAbilities,
                authMethod,
            });
            setSessionSigs(sessionSigs);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }), [sessionDuration]);
    return {
        initSession,
        sessionSigs,
        loading,
        error,
    };
}
//# sourceMappingURL=useLitSession.js.map