"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMethodsLib = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const WalletMethodsLib = ({ connectors, authWithEthWallet, setView, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Connect your web3 wallet" }), (0, jsx_runtime_1.jsx)("p", { children: "Connect your wallet then sign a message to verify you're the owner of the address." }), (0, jsx_runtime_1.jsxs)("div", { className: "buttons-container", children: [connectors.map(connector => ((0, jsx_runtime_1.jsxs)("button", { type: "button", className: "btn btn--outline", disabled: !connector.ready, onClick: () => authWithEthWallet(connector), children: [connector.icon && ((0, jsx_runtime_1.jsx)("div", { className: "btn__icon", children: (0, jsx_runtime_1.jsx)("img", { src: connector.icon, alt: `${connector.name} logo`, style: { width: '100%', height: '100%' } }) })), (0, jsx_runtime_1.jsxs)("span", { className: "btn__label", children: ["Continue with ", connector.name] })] }, connector.id))), (0, jsx_runtime_1.jsx)("button", { onClick: () => setView('default'), className: "btn btn--link", children: "Back" })] })] }));
};
exports.WalletMethodsLib = WalletMethodsLib;
//# sourceMappingURL=WalletMethods.js.map