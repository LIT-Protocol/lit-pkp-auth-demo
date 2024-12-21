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
exports.AccountSelectionLib = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AccountSelectionLib = ({ accounts, setCurrentAccount, error, }) => {
    const [selectedValue, setSelectedValue] = (0, react_1.useState)('0');
    function handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const account = accounts[parseInt(selectedValue)];
            return setCurrentAccount(account);
        });
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "container", children: (0, jsx_runtime_1.jsxs)("div", { className: "wrapper", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert--error", children: (0, jsx_runtime_1.jsx)("p", { children: error.message }) })), (0, jsx_runtime_1.jsx)("h1", { children: "Choose your account" }), (0, jsx_runtime_1.jsx)("p", { children: "Continue with one of your accounts." }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "form", children: [(0, jsx_runtime_1.jsx)("div", { className: "accounts-wrapper", role: "radiogroup", "aria-label": "View accounts", children: accounts.map((account, index) => ((0, jsx_runtime_1.jsx)("div", { className: `account-item ${selectedValue === index.toString() && 'account-item--selected'}`, children: (0, jsx_runtime_1.jsxs)("label", { className: "account-item__label", children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", className: "account-item__radio", name: "account", value: index.toString(), checked: selectedValue === index.toString(), onChange: (e) => setSelectedValue(e.target.value), "aria-label": account.ethAddress.toLowerCase() }), (0, jsx_runtime_1.jsx)("span", { className: "account-item__indicator" }), (0, jsx_runtime_1.jsx)("span", { className: "account-item__text", children: account.ethAddress.toLowerCase() })] }) }, `account-${index}`))) }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn--primary", children: "Continue" })] })] }) }));
};
exports.AccountSelectionLib = AccountSelectionLib;
//# sourceMappingURL=AccountSelection.js.map