"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardLib = void 0;
const react_1 = __importDefault(require("react"));
const DashboardLib = ({ account, onDisconnect, onSwitchAccount, }) => {
    if (!account) {
        return null;
    }
    return (react_1.default.createElement("div", { className: "container" },
        react_1.default.createElement("div", { className: "wrapper" },
            react_1.default.createElement("h1", null, "Dashboard"),
            react_1.default.createElement("div", { className: "account-info" },
                react_1.default.createElement("h2", null, "Current Account"),
                react_1.default.createElement("p", { className: "account-address" }, account.ethAddress.toLowerCase()),
                react_1.default.createElement("div", { className: "buttons-container" },
                    react_1.default.createElement("button", { type: "button", className: "btn btn--outline", onClick: onSwitchAccount }, "Switch Account"),
                    react_1.default.createElement("button", { type: "button", className: "btn btn--outline btn--danger", onClick: onDisconnect }, "Disconnect"))))));
};
exports.DashboardLib = DashboardLib;
//# sourceMappingURL=Dashboard.js.map