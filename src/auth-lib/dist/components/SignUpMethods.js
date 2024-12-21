"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpMethodsLib = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const AuthMethods_1 = require("./AuthMethods");
const WebAuthn_1 = require("./WebAuthn");
const StytchOTP_1 = require("./StytchOTP");
const WalletMethods_1 = require("./WalletMethods");
const SignUpMethodsLib = ({ handleGoogleLogin, handleDiscordLogin, authWithStytch, authWithEthWallet, registerWithWebAuthn, authWithWebAuthn, onSendCode, onVerifyCode, connectors, error, }) => {
    const [view, setView] = react_1.default.useState('default');
    const handleSetView = (newView) => setView(newView);
    return (() => ((0, jsx_runtime_1.jsx)("div", { className: "container", children: (0, jsx_runtime_1.jsxs)("div", { className: "wrapper", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert--error", children: (0, jsx_runtime_1.jsx)("p", { children: error.message }) })), view === 'default' && ((0, jsx_runtime_1.jsx)(AuthMethods_1.AuthMethodsLib, { handleGoogleLogin: handleGoogleLogin, handleDiscordLogin: handleDiscordLogin, setView: handleSetView })), view === 'email' && ((0, jsx_runtime_1.jsx)(StytchOTP_1.StytchOTPLib, { method: "email", authWithStytch: authWithStytch, setView: handleSetView, onSendCode: onSendCode, onVerifyCode: onVerifyCode })), view === 'phone' && ((0, jsx_runtime_1.jsx)(StytchOTP_1.StytchOTPLib, { method: "phone", authWithStytch: authWithStytch, setView: handleSetView, onSendCode: onSendCode, onVerifyCode: onVerifyCode })), view === 'wallet' && ((0, jsx_runtime_1.jsx)(WalletMethods_1.WalletMethodsLib, { connectors: connectors, authWithEthWallet: authWithEthWallet, setView: setView })), view === 'webauthn' && ((0, jsx_runtime_1.jsx)(WebAuthn_1.WebAuthnLib, { start: "register", authWithWebAuthn: authWithWebAuthn, registerWithWebAuthn: registerWithWebAuthn, setView: setView }))] }) })))();
};
exports.SignUpMethodsLib = SignUpMethodsLib;
//# sourceMappingURL=SignUpMethods.js.map