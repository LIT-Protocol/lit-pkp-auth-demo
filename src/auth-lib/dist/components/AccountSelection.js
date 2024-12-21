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
exports.AccountSelectionLib = void 0;
const react_1 = __importStar(require("react"));
const AccountSelectionLib = ({ accounts, setCurrentAccount, error, }) => {
    const [selectedValue, setSelectedValue] = (0, react_1.useState)('0');
    function handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const account = accounts[parseInt(selectedValue)];
            return setCurrentAccount(account);
        });
    }
    return (react_1.default.createElement("div", { className: "container" },
        react_1.default.createElement("div", { className: "wrapper" },
            error && (react_1.default.createElement("div", { className: "alert alert--error" },
                react_1.default.createElement("p", null, error.message))),
            react_1.default.createElement("h1", null, "Choose your account"),
            react_1.default.createElement("p", null, "Continue with one of your accounts."),
            react_1.default.createElement("form", { onSubmit: handleSubmit, className: "form" },
                react_1.default.createElement("div", { className: "accounts-wrapper", role: "radiogroup", "aria-label": "View accounts" }, accounts.map((account, index) => (react_1.default.createElement("div", { key: `account-${index}`, className: `account-item ${selectedValue === index.toString() && 'account-item--selected'}` },
                    react_1.default.createElement("label", { className: "account-item__label" },
                        react_1.default.createElement("input", { type: "radio", className: "account-item__radio", name: "account", value: index.toString(), checked: selectedValue === index.toString(), onChange: (e) => setSelectedValue(e.target.value), "aria-label": account.ethAddress.toLowerCase() }),
                        react_1.default.createElement("span", { className: "account-item__indicator" }),
                        react_1.default.createElement("span", { className: "account-item__text" }, account.ethAddress.toLowerCase())))))),
                react_1.default.createElement("button", { type: "submit", className: "btn btn--primary" }, "Continue")))));
};
exports.AccountSelectionLib = AccountSelectionLib;
//# sourceMappingURL=AccountSelection.js.map