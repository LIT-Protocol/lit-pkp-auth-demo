"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountLib = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const CreateAccountLib = ({ signUp, error }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "container", children: (0, jsx_runtime_1.jsxs)("div", { className: "wrapper", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert--error", children: (0, jsx_runtime_1.jsx)("p", { children: error.message }) })), (0, jsx_runtime_1.jsx)("h1", { children: "Need a PKP?" }), (0, jsx_runtime_1.jsx)("p", { children: "There doesn't seem to be a Lit wallet associated with your credentials. Create one today." }), (0, jsx_runtime_1.jsx)("div", { className: "buttons-container", children: (0, jsx_runtime_1.jsx)("button", { onClick: signUp, className: "btn btn--primary", children: "Sign up" }) })] }) }));
};
exports.CreateAccountLib = CreateAccountLib;
//# sourceMappingURL=CreateAccount.js.map