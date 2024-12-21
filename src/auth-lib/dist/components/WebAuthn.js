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
exports.WebAuthnLib = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
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
        return ((0, jsx_runtime_1.jsxs)("div", { children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert--error", children: (0, jsx_runtime_1.jsx)("p", { children: error.message }) })), (0, jsx_runtime_1.jsxs)("div", { className: "loader-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "loader" }), (0, jsx_runtime_1.jsx)("p", { children: "Follow the prompts to continue..." })] })] }));
    }
    const renderContent = () => {
        if (loading) {
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert--error", children: (0, jsx_runtime_1.jsx)("p", { children: error.message }) })), (0, jsx_runtime_1.jsxs)("div", { className: "loader-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "loader" }), (0, jsx_runtime_1.jsx)("p", { children: "Follow the prompts to continue..." })] })] }));
        }
        return ((0, jsx_runtime_1.jsxs)("div", { children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert--error", children: (0, jsx_runtime_1.jsx)("p", { children: error.message }) })), step === 'register' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Register with a passkey" }), (0, jsx_runtime_1.jsx)("p", { children: "Passkeys enable simple and secure passwordless authentication." }), (0, jsx_runtime_1.jsxs)("div", { className: "buttons-container", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: `btn btn--outline ${loading && 'btn--loading'}`, onClick: handleRegister, disabled: loading, children: "Create a credential" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setView('default'), className: "btn btn--link", children: "Back" })] })] })), step === 'authenticate' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Authenticate with your passkey" }), (0, jsx_runtime_1.jsx)("p", { children: "Sign in using your passkey." }), (0, jsx_runtime_1.jsxs)("div", { className: "buttons-container", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: `btn btn--outline ${loading && 'btn--loading'}`, onClick: authWithWebAuthn, disabled: loading, children: "Sign in with passkey" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setView('default'), className: "btn btn--link", children: "Back" })] })] }))] }));
    };
    return renderContent();
};
exports.WebAuthnLib = WebAuthnLib;
//# sourceMappingURL=WebAuthn.js.map