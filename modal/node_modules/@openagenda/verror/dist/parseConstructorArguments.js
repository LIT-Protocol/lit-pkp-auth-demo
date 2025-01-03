var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/parseConstructorArguments.js
var parseConstructorArguments_exports = {};
__export(parseConstructorArguments_exports, {
  default: () => parseConstructorArguments
});
module.exports = __toCommonJS(parseConstructorArguments_exports);
var import_sprintf_js = require("sprintf-js");
var import_assertion_error = __toESM(require("assertion-error"));

// src/assert.js
function isError(arg) {
  return Object.prototype.toString.call(arg) === "[object Error]" || arg instanceof Error;
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function isString(arg) {
  return typeof arg === "string";
}

// src/parseConstructorArguments.js
function parseConstructorArguments(...argv) {
  let options;
  let sprintfArgs;
  if (argv.length === 0) {
    options = {};
    sprintfArgs = [];
  } else if (isError(argv[0])) {
    options = { cause: argv[0] };
    sprintfArgs = argv.slice(1);
  } else if (typeof argv[0] === "object") {
    options = {};
    for (const k in argv[0]) {
      if (Object.prototype.hasOwnProperty.call(argv[0], k)) {
        options[k] = argv[0][k];
      }
    }
    sprintfArgs = argv.slice(1);
  } else {
    if (!isString(argv[0])) {
      throw new import_assertion_error.default(
        "first argument to VError, or WError constructor must be a string, object, or Error"
      );
    }
    options = {};
    sprintfArgs = argv;
  }
  if (!isObject(options))
    throw new import_assertion_error.default("options (object) is required");
  if (options.meta && !isObject(options.meta))
    throw new import_assertion_error.default("options.meta must be an object");
  return {
    options,
    shortMessage: sprintfArgs.length === 0 ? "" : import_sprintf_js.sprintf.apply(null, sprintfArgs)
  };
}
