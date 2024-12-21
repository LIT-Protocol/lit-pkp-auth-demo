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
exports.StytchOTPLib = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [step === 'submit' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert--error", children: (0, jsx_runtime_1.jsx)("p", { children: error.message }) })), (0, jsx_runtime_1.jsxs)("h1", { children: ["Enter your ", method] }), (0, jsx_runtime_1.jsxs)("p", { children: ["A verification code will be sent to your ", method, "."] }), (0, jsx_runtime_1.jsx)("div", { className: "form-wrapper", children: (0, jsx_runtime_1.jsxs)("form", { className: "form", onSubmit: sendPasscode, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: method, className: "sr-only", children: method === 'email' ? 'Email' : 'Phone number' }), (0, jsx_runtime_1.jsx)("input", { id: method, value: userId, onChange: e => setUserId(e.target.value), type: method === 'email' ? 'email' : 'tel', name: method, className: "form__input", placeholder: method === 'email' ? 'Your email' : 'Your phone number', autoComplete: "off" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn--primary", disabled: loading, children: "Send code" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setView('default'), className: "btn btn--link", children: "Back" })] }) })] })), step === 'verify' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("h1", { children: ["Check your ", method] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Enter the 6-digit verification code to ", userId] }), (0, jsx_runtime_1.jsx)("div", { className: "form-wrapper", children: (0, jsx_runtime_1.jsxs)("form", { className: "form", onSubmit: authenticate, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "code", className: "sr-only", children: "Code" }), (0, jsx_runtime_1.jsx)("input", { id: "code", value: code, onChange: e => setCode(e.target.value), type: "text", name: "code", className: "form__input", placeholder: "Verification code", autoComplete: "off" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn--primary", children: "Verify" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setStep('submit'), className: "btn btn--outline", children: "Try again" })] }) })] }))] }));
};
exports.StytchOTPLib = StytchOTPLib;
//# sourceMappingURL=StytchOTP.js.map