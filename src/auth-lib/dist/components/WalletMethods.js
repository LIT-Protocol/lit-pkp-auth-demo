"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMethodsLib = void 0;
const react_1 = __importDefault(require("react"));
const WalletMethodsLib = ({ connectors, authWithEthWallet, setView, }) => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "Connect your web3 wallet"),
        react_1.default.createElement("p", null, "Connect your wallet then sign a message to verify you're the owner of the address."),
        react_1.default.createElement("div", { className: "buttons-container" },
            connectors.map(connector => (react_1.default.createElement("button", { type: "button", className: "btn btn--outline", disabled: !connector.ready, key: connector.id, onClick: () => authWithEthWallet(connector) },
                connector.icon && (react_1.default.createElement("div", { className: "btn__icon" },
                    react_1.default.createElement("img", { src: connector.icon, alt: `${connector.name} logo`, style: { width: '100%', height: '100%' } }))),
                react_1.default.createElement("span", { className: "btn__label" },
                    "Continue with ",
                    connector.name)))),
            react_1.default.createElement("button", { onClick: () => setView('default'), className: "btn btn--link" }, "Back"))));
};
exports.WalletMethodsLib = WalletMethodsLib;
//# sourceMappingURL=WalletMethods.js.map