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
exports.useLitSession = useLitSession;
const react_1 = require("react");
const lit_1 = require("../utils/lit");
const LitAbility = {
    PKPSigning: 'pkp-signing'
};
class LitActionResource {
    constructor(resource) {
        this.resource = resource;
    }
    toJSON() {
        return { resource: this.resource };
    }
}
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
                    resource: { resource: '*' },
                    ability: LitAbility.PKPSigning,
                },
            ];
            const expiration = new Date(Date.now() + sessionDuration).toISOString();
            const sessionSigs = yield (0, lit_1.getSessionSigs)({
                chain,
                expiration,
                resourceAbilityRequests: resourceAbilities,
                authSig: authMethod,
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