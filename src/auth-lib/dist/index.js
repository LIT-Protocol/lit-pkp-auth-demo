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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountLib = exports.LoadingLib = exports.DashboardLib = exports.SignUpMethodsLib = exports.LoginMethodsLib = exports.AccountSelectionLib = exports.WalletMethodsLib = exports.StytchOTPLib = exports.WebAuthnLib = exports.AuthMethodsLib = exports.useLitAccounts = exports.useLitSession = exports.useLitAuth = exports.LitAuthProvider = void 0;
var LitAuthProvider_1 = require("./components/LitAuthProvider");
Object.defineProperty(exports, "LitAuthProvider", { enumerable: true, get: function () { return LitAuthProvider_1.LitAuthProvider; } });
Object.defineProperty(exports, "useLitAuth", { enumerable: true, get: function () { return LitAuthProvider_1.useLitAuth; } });
var useLitSession_1 = require("./hooks/useLitSession");
Object.defineProperty(exports, "useLitSession", { enumerable: true, get: function () { return useLitSession_1.useLitSession; } });
var useLitAccounts_1 = require("./hooks/useLitAccounts");
Object.defineProperty(exports, "useLitAccounts", { enumerable: true, get: function () { return useLitAccounts_1.useLitAccounts; } });
var AuthMethods_1 = require("./components/AuthMethods");
Object.defineProperty(exports, "AuthMethodsLib", { enumerable: true, get: function () { return AuthMethods_1.AuthMethodsLib; } });
var WebAuthn_1 = require("./components/WebAuthn");
Object.defineProperty(exports, "WebAuthnLib", { enumerable: true, get: function () { return WebAuthn_1.WebAuthnLib; } });
var StytchOTP_1 = require("./components/StytchOTP");
Object.defineProperty(exports, "StytchOTPLib", { enumerable: true, get: function () { return StytchOTP_1.StytchOTPLib; } });
var WalletMethods_1 = require("./components/WalletMethods");
Object.defineProperty(exports, "WalletMethodsLib", { enumerable: true, get: function () { return WalletMethods_1.WalletMethodsLib; } });
__exportStar(require("./utils/lit"), exports);
var AccountSelection_1 = require("./components/AccountSelection");
Object.defineProperty(exports, "AccountSelectionLib", { enumerable: true, get: function () { return AccountSelection_1.AccountSelectionLib; } });
var LoginMethods_1 = require("./components/LoginMethods");
Object.defineProperty(exports, "LoginMethodsLib", { enumerable: true, get: function () { return LoginMethods_1.LoginMethodsLib; } });
var SignUpMethods_1 = require("./components/SignUpMethods");
Object.defineProperty(exports, "SignUpMethodsLib", { enumerable: true, get: function () { return SignUpMethods_1.SignUpMethodsLib; } });
var Dashboard_1 = require("./components/Dashboard");
Object.defineProperty(exports, "DashboardLib", { enumerable: true, get: function () { return Dashboard_1.DashboardLib; } });
var Loading_1 = require("./components/Loading");
Object.defineProperty(exports, "LoadingLib", { enumerable: true, get: function () { return Loading_1.LoadingLib; } });
var CreateAccount_1 = require("./components/CreateAccount");
Object.defineProperty(exports, "CreateAccountLib", { enumerable: true, get: function () { return CreateAccount_1.CreateAccountLib; } });
//# sourceMappingURL=index.js.map