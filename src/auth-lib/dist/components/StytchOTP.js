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
exports.StytchOTPLib = void 0;
const react_1 = __importStar(require("react"));
const StytchOTPLib = ({ method, authWithStytch, setView, onSendCode, onVerifyCode, }) => {
    const [step, setStep] = (0, react_1.useState)('submit');
    const [userId, setUserId] = (0, react_1.useState)('');
    const [methodId, setMethodId] = (0, react_1.useState)('');
    const [code, setCode] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    const sendPasscode = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        setLoading(true);
        setError(undefined);
        try {
            const response = yield onSendCode(userId, method);
            setMethodId(response.methodId);
            setStep('verify');
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
        finally {
            setLoading(false);
        }
    });
    const authenticate = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        setLoading(true);
        setError(undefined);
        try {
            const response = yield onVerifyCode(code, methodId);
            yield authWithStytch(response.sessionJwt, response.userId, method);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
        finally {
            setLoading(false);
        }
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        step === 'submit' && (react_1.default.createElement(react_1.default.Fragment, null,
            error && (react_1.default.createElement("div", { className: "alert alert--error" },
                react_1.default.createElement("p", null, error.message))),
            react_1.default.createElement("h1", null,
                "Enter your ",
                method),
            react_1.default.createElement("p", null,
                "A verification code will be sent to your ",
                method,
                "."),
            react_1.default.createElement("div", { className: "form-wrapper" },
                react_1.default.createElement("form", { className: "form", onSubmit: sendPasscode },
                    react_1.default.createElement("label", { htmlFor: method, className: "sr-only" }, method === 'email' ? 'Email' : 'Phone number'),
                    react_1.default.createElement("input", { id: method, value: userId, onChange: e => setUserId(e.target.value), type: method === 'email' ? 'email' : 'tel', name: method, className: "form__input", placeholder: method === 'email' ? 'Your email' : 'Your phone number', autoComplete: "off" }),
                    react_1.default.createElement("button", { type: "submit", className: "btn btn--primary", disabled: loading }, "Send code"),
                    react_1.default.createElement("button", { onClick: () => setView('default'), className: "btn btn--link" }, "Back"))))),
        step === 'verify' && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("h1", null,
                "Check your ",
                method),
            react_1.default.createElement("p", null,
                "Enter the 6-digit verification code to ",
                userId),
            react_1.default.createElement("div", { className: "form-wrapper" },
                react_1.default.createElement("form", { className: "form", onSubmit: authenticate },
                    react_1.default.createElement("label", { htmlFor: "code", className: "sr-only" }, "Code"),
                    react_1.default.createElement("input", { id: "code", value: code, onChange: e => setCode(e.target.value), type: "text", name: "code", className: "form__input", placeholder: "Verification code", autoComplete: "off" }),
                    react_1.default.createElement("button", { type: "submit", className: "btn btn--primary" }, "Verify"),
                    react_1.default.createElement("button", { onClick: () => setStep('submit'), className: "btn btn--outline" }, "Try again")))))));
};
exports.StytchOTPLib = StytchOTPLib;
//# sourceMappingURL=StytchOTP.js.map