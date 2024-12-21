"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.LitAuthProvider = exports.useLitAuth = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const LitNodeClient = __importStar(require("@lit-protocol/lit-node-client"));
const LitAuthClient = __importStar(require("@lit-protocol/lit-auth-client"));
const LitAuthContext = (0, react_1.createContext)({
    litNodeClient: null,
    authClient: null,
    session: null,
    accounts: [],
    authenticate: () => __awaiter(void 0, void 0, void 0, function* () { }),
    loading: false,
});
const useLitAuth = () => (0, react_1.useContext)(LitAuthContext);
exports.useLitAuth = useLitAuth;
const LitAuthProvider = ({ children }) => {
    const [litNodeClient, setLitNodeClient] = (0, react_1.useState)(null);
    const [authClient, setAuthClient] = (0, react_1.useState)(null);
    const [session, setSession] = (0, react_1.useState)(null);
    const [accounts, setAccounts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const initClients = () => __awaiter(void 0, void 0, void 0, function* () {
            const nodeClient = new LitNodeClient.LitNodeClient({
                litNetwork: process.env.NEXT_PUBLIC_LIT_NETWORK || 'datil-dev',
            });
            yield nodeClient.connect();
            setLitNodeClient(nodeClient);
            const client = new LitAuthClient.LitAuthClient({
                litRelayConfig: {
                    relayApiKey: process.env.NEXT_PUBLIC_LIT_RELAY_API_KEY,
                },
            });
            setAuthClient(client);
        });
        initClients();
    }, []);
    const authenticate = (method) => __awaiter(void 0, void 0, void 0, function* () {
        if (!authClient)
            return;
        setLoading(true);
        try {
            setLoading(false);
        }
        catch (err) {
            console.error('Error during authentication:', err);
            setLoading(false);
        }
    });
    const value = {
        litNodeClient,
        authClient,
        session,
        accounts,
        authenticate,
        loading,
    };
    return ((0, jsx_runtime_1.jsx)(LitAuthContext.Provider, { value: value, children: children }));
};
exports.LitAuthProvider = LitAuthProvider;
//# sourceMappingURL=LitAuthProvider.js.map