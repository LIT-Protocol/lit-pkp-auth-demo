"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginMethodsLib = void 0;
const react_1 = __importDefault(require("react"));
const AuthMethods_1 = require("./AuthMethods");
const WebAuthn_1 = require("./WebAuthn");
const StytchOTP_1 = require("./StytchOTP");
const WalletMethods_1 = require("./WalletMethods");
const LoginMethodsLib = ({ handleGoogleLogin, handleDiscordLogin, authWithStytch, authWithEthWallet, authWithWebAuthn, onSendCode, onVerifyCode, connectors, error, }) => {
    const [view, setView] = react_1.default.useState('default');
    const handleSetView = (newView) => setView(newView);
    return (() => (react_1.default.createElement("div", { className: "container" },
        react_1.default.createElement("div", { className: "wrapper" },
            error && (react_1.default.createElement("div", { className: "alert alert--error" },
                react_1.default.createElement("p", null, error.message))),
            view === 'default' && (react_1.default.createElement(AuthMethods_1.AuthMethodsLib, { handleGoogleLogin: handleGoogleLogin, handleDiscordLogin: handleDiscordLogin, setView: handleSetView })),
            view === 'email' && (react_1.default.createElement(StytchOTP_1.StytchOTPLib, { method: "email", authWithStytch: authWithStytch, setView: handleSetView, onSendCode: onSendCode, onVerifyCode: onVerifyCode })),
            view === 'phone' && (react_1.default.createElement(StytchOTP_1.StytchOTPLib, { method: "phone", authWithStytch: authWithStytch, setView: handleSetView, onSendCode: onSendCode, onVerifyCode: onVerifyCode })),
            view === 'wallet' && (react_1.default.createElement(WalletMethods_1.WalletMethodsLib, { connectors: connectors, authWithEthWallet: authWithEthWallet, setView: setView })),
            view === 'webauthn' && (react_1.default.createElement(WebAuthn_1.WebAuthnLib, { start: "authenticate", authWithWebAuthn: authWithWebAuthn, setView: setView }))))))();
};
exports.LoginMethodsLib = LoginMethodsLib;
//# sourceMappingURL=LoginMethods.js.map