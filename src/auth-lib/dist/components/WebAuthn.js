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
exports.WebAuthnLib = void 0;
const react_1 = __importStar(require("react"));
const WebAuthnLib = ({ start, authWithWebAuthn, setView, registerWithWebAuthn, }) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    const [step, setStep] = (0, react_1.useState)(start);
    const handleRegister = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!registerWithWebAuthn)
            return;
        setError(undefined);
        setLoading(true);
        try {
            yield registerWithWebAuthn();
            setStep('authenticate');
        }
        catch (err) {
            console.error(err);
            setError(err instanceof Error ? err : new Error(String(err)));
        }
        setLoading(false);
    });
    if (loading) {
        return (react_1.default.createElement("div", null,
            error && (react_1.default.createElement("div", { className: "alert alert--error" },
                react_1.default.createElement("p", null, error.message))),
            react_1.default.createElement("div", { className: "loader-container" },
                react_1.default.createElement("div", { className: "loader" }),
                react_1.default.createElement("p", null, "Follow the prompts to continue..."))));
    }
    const renderContent = () => {
        if (loading) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                error && (react_1.default.createElement("div", { className: "alert alert--error" },
                    react_1.default.createElement("p", null, error.message))),
                react_1.default.createElement("div", { className: "loader-container" },
                    react_1.default.createElement("div", { className: "loader" }),
                    react_1.default.createElement("p", null, "Follow the prompts to continue..."))));
        }
        return (react_1.default.createElement("div", null,
            error && (react_1.default.createElement("div", { className: "alert alert--error" },
                react_1.default.createElement("p", null, error.message))),
            step === 'register' && (react_1.default.createElement("div", null,
                react_1.default.createElement("h1", null, "Register with a passkey"),
                react_1.default.createElement("p", null, "Passkeys enable simple and secure passwordless authentication."),
                react_1.default.createElement("div", { className: "buttons-container" },
                    react_1.default.createElement("button", { type: "button", className: `btn btn--outline ${loading && 'btn--loading'}`, onClick: handleRegister, disabled: loading }, "Create a credential"),
                    react_1.default.createElement("button", { onClick: () => setView('default'), className: "btn btn--link" }, "Back")))),
            step === 'authenticate' && (react_1.default.createElement("div", null,
                react_1.default.createElement("h1", null, "Authenticate with your passkey"),
                react_1.default.createElement("p", null, "Sign in using your passkey."),
                react_1.default.createElement("div", { className: "buttons-container" },
                    react_1.default.createElement("button", { type: "button", className: `btn btn--outline ${loading && 'btn--loading'}`, onClick: authWithWebAuthn, disabled: loading }, "Sign in with passkey"),
                    react_1.default.createElement("button", { onClick: () => setView('default'), className: "btn btn--link" }, "Back"))))));
    };
    return renderContent();
};
exports.WebAuthnLib = WebAuthnLib;
//# sourceMappingURL=WebAuthn.js.map