"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardLib = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const DashboardLib = ({ account, onDisconnect, onSwitchAccount, }) => {
    if (!account) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "container", children: (0, jsx_runtime_1.jsxs)("div", { className: "wrapper", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Dashboard" }), (0, jsx_runtime_1.jsxs)("div", { className: "account-info", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Current Account" }), (0, jsx_runtime_1.jsx)("p", { className: "account-address", children: account.ethAddress.toLowerCase() }), (0, jsx_runtime_1.jsxs)("div", { className: "buttons-container", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn btn--outline", onClick: onSwitchAccount, children: "Switch Account" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn btn--outline btn--danger", onClick: onDisconnect, children: "Disconnect" })] })] })] }) }));
};
exports.DashboardLib = DashboardLib;
//# sourceMappingURL=Dashboard.js.map