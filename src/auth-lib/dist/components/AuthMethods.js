"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMethodsLib = void 0;
const react_1 = __importDefault(require("react"));
const AuthMethodsLib = ({ handleGoogleLogin, handleDiscordLogin, setView, googleIconUrl = '/google.png', discordIconUrl = '/discord.png', }) => {
    return (react_1.default.createElement("div", { className: "buttons-container" },
        react_1.default.createElement("div", { className: "social-container" },
            react_1.default.createElement("button", { type: "button", className: "btn btn--outline", onClick: handleGoogleLogin },
                react_1.default.createElement("div", { className: "btn__icon" },
                    react_1.default.createElement("img", { src: googleIconUrl, alt: "Google logo", style: { width: '100%', height: '100%' } })),
                react_1.default.createElement("span", { className: "btn__label" }, "Google")),
            react_1.default.createElement("button", { type: "button", className: "btn btn--outline", onClick: handleDiscordLogin },
                react_1.default.createElement("div", { className: "btn__icon" },
                    react_1.default.createElement("img", { src: discordIconUrl, alt: "Discord logo", style: { width: '100%', height: '100%' } })),
                react_1.default.createElement("span", { className: "btn__label" }, "Discord"))),
        react_1.default.createElement("button", { type: "button", className: "btn btn--outline", onClick: () => setView('email') },
            react_1.default.createElement("div", { className: "btn__icon" },
                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" }))),
            react_1.default.createElement("span", { className: "btn__label" }, "Continue with email")),
        react_1.default.createElement("button", { type: "button", className: "btn btn--outline", onClick: () => setView('phone') },
            react_1.default.createElement("div", { className: "btn__icon" },
                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" }))),
            react_1.default.createElement("span", { className: "btn__label" }, "Continue with phone")),
        react_1.default.createElement("button", { type: "button", className: "btn btn--outline", onClick: () => setView('wallet') },
            react_1.default.createElement("div", { className: "btn__icon" },
                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" }))),
            react_1.default.createElement("span", { className: "btn__label" }, "Connect your web3 wallet")),
        react_1.default.createElement("button", { type: "button", className: "btn btn--outline", onClick: () => setView('webauthn') },
            react_1.default.createElement("div", { className: "btn__icon" },
                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" }))),
            react_1.default.createElement("span", { className: "btn__label" }, "Use a passkey"))));
};
exports.AuthMethodsLib = AuthMethodsLib;
//# sourceMappingURL=AuthMethods.js.map