"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingLib = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const LoadingLib = ({ copy, error }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "container", children: (0, jsx_runtime_1.jsxs)("div", { className: "wrapper", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert--error", children: (0, jsx_runtime_1.jsx)("p", { children: error.message }) })), (0, jsx_runtime_1.jsxs)("div", { className: "loader-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "loader" }), (0, jsx_runtime_1.jsx)("p", { children: copy })] })] }) }));
};
exports.LoadingLib = LoadingLib;
//# sourceMappingURL=Loading.js.map