var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/assert.js
var assert_exports = {};
__export(assert_exports, {
  isError: () => isError,
  isFunc: () => isFunc,
  isObject: () => isObject,
  isString: () => isString
});
module.exports = __toCommonJS(assert_exports);
function isError(arg) {
  return Object.prototype.toString.call(arg) === "[object Error]" || arg instanceof Error;
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function isString(arg) {
  return typeof arg === "string";
}
function isFunc(arg) {
  return typeof arg === "function";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isError,
  isFunc,
  isObject,
  isString
});
